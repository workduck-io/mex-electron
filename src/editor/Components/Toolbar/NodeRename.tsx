import React, { useEffect, useMemo, useRef, useState } from 'react'

import { getNameFromPath, getParentFromPath, SEPARATOR } from '@components/mex/Sidebar/treeUtils'
import { useNodes } from '@hooks/useNodes'
import { useKeyListener } from '@hooks/useShortcutListener'
import useDataStore from '@store/useDataStore'
import { useHelpStore } from '@store/useHelpStore'
import Tippy from '@tippyjs/react'
import { getPlateEditorRef, selectEditor } from '@udecode/plate'
import toast from 'react-hot-toast'

import { Button, DisplayShortcut } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { doesLinkRemain } from '../../../components/mex/Refactor/doesLinkRemain'
import { useNavigation } from '../../../hooks/useNavigation'
import { useRefactor } from '../../../hooks/useRefactor'
import { useAnalysisStore } from '../../../store/useAnalysis'
import { useEditorStore } from '../../../store/useEditorStore'
import { useRenameStore } from '../../../store/useRenameStore'
import { Input } from '../../../style/Form'
import { isClash, isMatch, isReserved } from '../../../utils/lib/paths'
import { ButtonWrapper, TitleStatic, Wrapper } from './NodeRename.style'
import { mog } from '@workduck-io/mex-utils'

const NodeRenameOnlyTitle = () => {
  const { execRefactorAsync, getMockRefactor } = useRefactor()

  const to = useRenameStore((store) => store.to)
  const ilinks = useDataStore((store) => store.ilinks)
  const nodeTitle = useAnalysisStore((state) => state.analysis.title)

  const { push } = useNavigation()
  const setMockRefactored = useRenameStore((store) => store.setMockRefactored)
  const modalReset = useRenameStore((store) => store.closeModal)
  const { path: nodeFrom, namespace: nodeFromNS } = useEditorStore((store) => store.node)
  const setFrom = useRenameStore((store) => store.setFrom)
  const [editable, setEditable] = useState(false)
  const [newTitle, setNewTitle] = useState(getNameFromPath(nodeFrom))
  const inpRef = useRef<HTMLInputElement>()
  const { updateBaseNode } = useNodes()
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
          setEditable(true)
          inpRef.current?.focus()
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  const handleSubmit: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()

      const to = getTo(newTitle)

      if (isMatch(to, nodeFrom)) {
        toast('Note itself cannot be used')
        return
      }

      // if (e.shiftKey) {
      //   // mog('Opening refactor')

      //   prefillRefactorModal(nodeFrom, to)
      // } else {
      // mog('Renaming')
      onRename()
      // }
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
    if (newTitle === getNameFromPath(nodeFrom) || isClashed || newTitle.indexOf(SEPARATOR) !== -1) {
      reset()
      return
    }

    const parent = getParentFromPath(nodeFrom)

    if (newTitle && nodeFrom) {
      let newPath = newTitle
      if (parent) newPath = `${parent}${SEPARATOR}${newTitle}`
      setFrom({ path: nodeFrom, namespaceID: nodeFromNS })

      const refactored = await execRefactorAsync(
        { path: nodeFrom, namespaceID: nodeFromNS },
        { path: newPath, namespaceID: nodeFromNS }
      )

      updateBaseNode()

      const path = useEditorStore.getState().node.id
      const nodeid = useEditorStore.getState().node.nodeid
      setEditable(false)

      if (doesLinkRemain(nodeid, refactored)) {
        push(nodeid)
      }
      // What is this code? Isn't res an object, what does res[0] refer to?
      else if (refactored.length > 0) {
        const nodeid = refactored[0].nodeid
        push(nodeid, { savePrev: false })
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
            disabled={getNameFromPath(nodeFrom) === newTitle || isClashed || newTitle.indexOf(SEPARATOR) !== -1}
            onMouseDown={onRenameClick}
          >
            <DisplayShortcut shortcut="Enter" />
            Rename
          </Button>
        </ButtonWrapper>
      )}
    </Wrapper>
  )
}

export default NodeRenameOnlyTitle
