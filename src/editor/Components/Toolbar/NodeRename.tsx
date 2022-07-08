import { useRefactorStore } from '@components/mex/Refactor/Refactor'
import { DisplayShortcut } from '@components/mex/Shortcuts'
import { getNameFromPath, getParentFromPath, SEPARATOR } from '@components/mex/Sidebar/treeUtils'
import { hierarchyParser } from '@hooks/useHierarchy'
import { useKeyListener } from '@hooks/useShortcutListener'
import useDataStore from '@store/useDataStore'
import { useHelpStore } from '@store/useHelpStore'
import Tippy from '@tippyjs/react'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import tinykeys from 'tinykeys'
import { doesLinkRemain } from '../../../components/mex/Refactor/doesLinkRemain'
import { useLinks } from '../../../hooks/useLinks'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useAnalysisStore } from '../../../store/useAnalysis'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRenameStore } from '../../../store/useRenameStore'
import { Button } from '../../../style/Buttons'
import { Input } from '../../../style/Form'
import { isClash, isMatch, isReserved } from '../../../utils/lib/paths'
import { ButtonWrapper, TitleStatic, Wrapper } from './NodeRename.style'

const NodeRenameOnlyTitle = () => {
  const { getNodeidFromPath } = useLinks()
  const { execRefactorAsync, getMockRefactor } = useRefactor()

  // const focus = useRenameStore((store) => store.focus)
  const to = useRenameStore((store) => store.to)
  const ilinks = useDataStore((store) => store.ilinks)
  // const from = useRenameStore((store) => store.from)
  const mockRefactored = useRenameStore((store) => store.mockRefactored)
  const nodeTitle = useAnalysisStore((state) => state.analysis.title)

  const { push } = useNavigation()
  const { updateILinks } = useLinks()
  const prefillRefactorModal = useRefactorStore((store) => store.prefillModal)
  const openModal = useRenameStore((store) => store.openModal)
  // const closeModal = useRenameStore((store) => store.closeModal)
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const modalReset = useRenameStore((store) => store.closeModal)
  const setTo = useRenameStore((store) => store.setTo)
  const nodeFrom = useEditorStore((store) => store.node.path ?? '')
  const setFrom = useRenameStore((store) => store.setFrom)
  const [editable, setEditable] = useState(false)
  const [newTitle, setNewTitle] = useState(getNameFromPath(nodeFrom))
  const inpRef = useRef<HTMLInputElement>()
  //
  //
  //

  const reset = () => {
    if (editable) modalReset()
    setEditable(false)
    setNewTitle(getNameFromPath(nodeFrom))
  }

  const getTo = (title: string) => {
    const nFrom = useEditorStore.getState().node.path
    const parent = getParentFromPath(nFrom)
    if (parent) return `${parent}${SEPARATOR}${title}`
    else return title
  }

  const isClashed = useMemo(() => {
    return isClash(
      getTo(newTitle),
      ilinks.map((n) => n.path)
    )
  }, [ilinks, newTitle])

  const { shortcutHandler } = useKeyListener()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showRename.keystrokes]: (event) => {
        event.preventDefault()
        // TODO: Fix the shortcut handler (not working after the shortcut is renamed)
        shortcutHandler(shortcuts.showRename, () => {
          console.log({ event })
          setEditable(true)
          inpRef.current.focus()
        })
      }
    })
    // console.log(shortcuts.showRename)
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const to = getTo(newTitle)

      if (isMatch(to, nodeFrom) && !e.shiftKey) {
        toast('Note itself cannot be used')
        return
      }

      if (e.shiftKey) {
        // mog('Opening refactor')

        prefillRefactorModal(nodeFrom, to)
      } else {
        // mog('Renaming')
        onRename()
      }
    } else if (e.key === 'Escape') reset()
  }

  const handleTitleChange = (e) => {
    // console.log({ parent })
    if (e.target.value) {
      // if (parent) setNewTitle(`${parent}${SEPARATOR}${e.target.value}`)
      setNewTitle(e.target.value)
    }
  }

  const onRenameClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    onRename()
  }

  const onRename = async () => {
    // console.log('renaming', {})
    if (newTitle === getNameFromPath(nodeFrom) || isClashed) {
      reset()
      return
    }
    const parent = getParentFromPath(nodeFrom)
    if (mockRefactored.length > 1) {
      if (parent) setTo(`${parent}${SEPARATOR}${newTitle}`)
      else setTo(newTitle)
      setFrom(nodeFrom)

      openModal()
      setEditable(false)
      return
    }
    if (newTitle && nodeFrom) {
      let newPath = newTitle
      if (parent) newPath = `${parent}${SEPARATOR}${newTitle}`
      setFrom(nodeFrom)

      const res = await execRefactorAsync(nodeFrom, newPath)

      const { addedPaths, removedPaths } = res
      const addedILinks = hierarchyParser(addedPaths)
      const removedILinks = hierarchyParser(removedPaths)

      // // * set the new hierarchy in the tree
      const refactored = updateILinks(addedILinks, removedILinks)

      const path = useEditorStore.getState().node.id
      const nodeid = useEditorStore.getState().node.nodeid
      setEditable(false)

      if (doesLinkRemain(path, refactored)) {
        push(nodeid)
      } else if (res.length > 0) {
        const nodeid = getNodeidFromPath(res[0].to)
        push(nodeid)
      }

      reset()

      const editorRef = getPlateEditorRef()
      if (editorRef) {
        selectEditor(editorRef, { edge: 'start', focus: true })
      }
    }
  }

  const onCancel: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    reset()
  }

  // useEffect(() => {
  //   if (nodeFrom && isReserved(nodeFrom)) {
  //     mog('ISRESERVED', { nodeFrom })
  //   }
  // }, [nodeFrom])

  useEffect(() => {
    if (newTitle && editable) {
      // mog('RenameInput', { id: useEditorStore.getState().node.id, to })
      if (newTitle === getNameFromPath(nodeFrom)) return
      setMockRefactored(getMockRefactor(useEditorStore.getState().node.id, getTo(newTitle), true, false))
    }
  }, [nodeFrom, newTitle, editable])

  useEffect(() => {
    reset()
  }, [nodeFrom])

  return (
    <Wrapper>
      {isReserved(nodeFrom) ? (
        <Tippy theme="mex" placement="bottom-start" content="Reserved Node">
          <TitleStatic>{nodeTitle?.length > 0 ? getNameFromPath(nodeTitle) : getNameFromPath(nodeFrom)}</TitleStatic>
        </Tippy>
      ) : editable ? (
        <Input
          id={`NodeRenameTitleSelect_${nodeFrom}_${to}`}
          name="NodeRenameTitleSelect"
          onKeyDown={handleSubmit}
          onChange={(e) => handleTitleChange(e)}
          onBlur={() => reset()}
          autoFocus
          defaultValue={newTitle}
          ref={inpRef}
        />
      ) : (
        <Tippy theme="mex" placement="bottom-start" content="Click to Rename">
          <TitleStatic
            onClick={(e) => {
              e.preventDefault()
              setEditable(true)
            }}
          >
            {getNameFromPath(nodeTitle?.length > 0 ? nodeTitle : nodeFrom)}
          </TitleStatic>
        </Tippy>
      )}
      {editable && (
        <ButtonWrapper>
          <Button
            primary
            key="ButtonRename"
            disabled={getNameFromPath(nodeFrom) === newTitle || isClashed}
            onMouseDown={onRenameClick}
          >
            <DisplayShortcut shortcut="Enter" />
            Rename
          </Button>
          <Button onMouseDown={onCancel}>
            <DisplayShortcut shortcut="Shift+Enter" />
            Open Refactor
          </Button>
        </ButtonWrapper>
      )}
    </Wrapper>
  )
}

export default NodeRenameOnlyTitle
