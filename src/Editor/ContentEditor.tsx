import React, { useEffect, useRef, useState } from 'react'
import { SAVE_WAIT_TIME } from '../Conf/times'
import tinykeys from 'tinykeys'
import { useHelpStore } from '../Components/Help/HelpModal'
import Metadata from '../Components/Metadata/Metadata'
import NodeIntentsModal from '../Components/NodeIntentsModal/NodeIntentsModal'
import { useKeyListener } from '../Hooks/useCustomShortcuts/useShortcutListener'
import useLoad from '../Hooks/useLoad/useLoad'
import { useNavigation } from '../Hooks/useNavigation/useNavigation'
import { useQStore, useSaveQ } from '../Hooks/useQ'
import useToggleElements from '../Hooks/useToggleElements/useToggleElements'
import useLayout from '../Layout/useLayout'
import { StyledEditor } from '../Styled/Editor'
import { useDataSaverFromContent } from './Components/Saver'
import Editor from './Editor'
import { useEditorStore } from './Store/EditorStore'
import Toolbar from './Toolbar'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { loadNode } = useLoad()

  const { showGraph } = useToggleElements()

  const uid = useEditorStore((state) => state.node.uid)
  const node = useEditorStore((state) => state.node)
  const fsContent = useEditorStore((state) => state.content)
  const lastChanged = useRef<number>(-1)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, uid])

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  const { move } = useNavigation()

  const { saveEditorAndUpdateStates } = useDataSaverFromContent()
  const add2Q = useQStore((s) => s.add2Q)

  // const { saveQ } = useSaveQ()

  const onChangeSave = (val: any[]) => {
    // console.log('onchange', { val, node })
    if (val && node && node.uid !== '__null__') {
      add2Q(node.uid)
      saveEditorAndUpdateStates(node, val, false)
    }
    // console.log('Q saving on lastChanged', {
    //   lc: lastChanged.current,
    //   dw: Date.now() + SAVE_WAIT_TIME,
    //   SAVE_WAIT_TIME
    // })
    // if (lastChanged.current !== -1 && lastChanged.current > Date.now() + SAVE_WAIT_TIME) {
    //   console.log('Q saving on lastChanged')
    //   const q = useQStore.getState().q
    //   if (q.length > 0) {
    //     console.log('Saving Q')
    //     saveQ()
    //   }
    //   // saveEditorAndUpdateStates(node, val, false)
    // }
    // lastChanged.current = Date.now()

    // console.log('lastChanged', { lc: lastChanged.current })
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.gotoBackwards.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.gotoBackwards, () => {
          move(-1)
        })
      },
      [shortcuts.gotoForward.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.gotoForward, () => {
          move(+1)
        })
      },
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.toggleFocusMode, () => {
          toggleFocusMode()
        })
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          loadNode(uid)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  // console.log('CE', { q })

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <Toolbar />
        <Metadata />

        <Editor
          showBalloonToolbar
          readOnly={fetchingContent}
          content={content}
          onChange={onChangeSave}
          editorId={`StandardEditor_${uid}_${fetchingContent ? 'loading' : 'edit'}`}
        />
      </StyledEditor>
      <NodeIntentsModal uid={uid} />
    </>
  )
}

export default ContentEditor
