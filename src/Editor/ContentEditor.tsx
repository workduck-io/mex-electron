import React, { useEffect, useRef, useState } from 'react'
import tinykeys from 'tinykeys'
import shallow from 'zustand/shallow'
import { useHelpStore } from '../Components/Help/HelpModal'
import Metadata from '../Components/Metadata/Metadata'
import NodeIntentsModal from '../Components/NodeIntentsModal/NodeIntentsModal'
import { useKeyListener } from '../Hooks/useCustomShortcuts/useShortcutListener'
import useLoad from '../Hooks/useLoad/useLoad'
import { useNavigation } from '../Hooks/useNavigation/useNavigation'
import { useQStore } from '../Hooks/useQ'
import useToggleElements from '../Hooks/useToggleElements/useToggleElements'
import useLayout from '../Layout/useLayout'
import { StyledEditor } from '../Styled/Editor'
import { useDataSaverFromContent } from './Components/Saver'
import Editor from './Editor'
import { useEditorStore } from './Store/EditorStore'
import Toolbar from './Toolbar'

interface ContentEditorState {
  uid: string
  content: any[] | undefined
}

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { loadNode } = useLoad()

  const { showGraph } = useToggleElements()

  // const uid = useEditorStore((state) => state.node.uid)
  // const node = useEditorStore((state) => state.node)
  // const fsContent = useEditorStore((state) => state.content)
  const { uid, node, fsContent } = useEditorStore(
    (state) => ({ uid: state.node.uid, node: state.node, fsContent: state.content }),
    shallow
  )
  // const { nuts, honey } = useStore(state => ({ nuts: state.nuts, honey: state.honey }), shallow)
  // const lastChanged = useRef<number>(-1)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // const [state, setState] = useState<ContentEditorState>({ uid, content: undefined })

  // useEffect(() => {
  //   if (fsContent) {
  //     console.log('Setting content from uid change', { fsContent, uid })
  //     // Setting content
  //     setState({ uid, content: fsContent })
  //   }
  // }, [uid])

  // useEffect(() => {
  //   if (fsContent) {
  //     console.log('Setting content from fs change', { fsContent, uid })
  //     // Setting content
  //     setState({ uid, content: fsContent })
  //   }
  // }, [])

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  const { move } = useNavigation()

  const { saveEditorAndUpdateStates } = useDataSaverFromContent()
  const add2Q = useQStore((s) => s.add2Q)

  const onChangeSave = (val: any[]) => {
    console.log('Trigger onChange', { node, val })
    if (val && node && node.uid !== '__null__') {
      console.log('Saving onChange', { node, val })

      add2Q(node.uid)
      saveEditorAndUpdateStates(node, val, false)
    }
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

  console.log('CE', { ce: `StandardEditor_${uid}_${fetchingContent ? 'loading' : 'edit'}`, fsContent, uid })

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <Toolbar />
        <Metadata />

        <Editor
          showBalloonToolbar
          readOnly={fetchingContent}
          content={fsContent}
          onChange={onChangeSave}
          editorId={`StandardEditor_${uid}_${fetchingContent ? 'loading' : 'edit'}`}
        />
      </StyledEditor>
      <NodeIntentsModal uid={uid} />
    </>
  )
}

export default ContentEditor
