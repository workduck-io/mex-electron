import React, { useEffect, useState } from 'react'
import tinykeys from 'tinykeys'
import { useHelpStore } from '../Components/Help/HelpModal'
import Metadata from '../Components/Metadata/Metadata'
import NodeIntentsModal from '../Components/NodeIntentsModal/NodeIntentsModal'
import { useKeyListener } from '../Hooks/useCustomShortcuts/useShortcutListener'
import useLoad from '../Hooks/useLoad/useLoad'
import { useNavigation } from '../Hooks/useNavigation/useNavigation'
import useToggleElements from '../Hooks/useToggleElements/useToggleElements'
import useLayout from '../Layout/useLayout'
import { StyledEditor } from '../Styled/Editor'
import Editor from './Editor'
import { useEditorStore } from './Store/EditorStore'
import Toolbar from './Toolbar'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  // const { loadNode } = useLoad()

  const { showGraph } = useToggleElements()

  const uid = useEditorStore((state) => state.node.uid)
  const fsContent = useEditorStore((state) => state.content)

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
          // loadNode(uid)
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  // console.log('CE', { isB: isBookmark(uid) })

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <Toolbar />
        <Metadata />

        <Editor
          showBalloonToolbar
          readOnly={fetchingContent}
          content={content}
          editorId={`StandardEditor_${uid}_${fetchingContent ? 'loading' : 'edit'}`}
        />
      </StyledEditor>
      <NodeIntentsModal uid={uid} />
    </>
  )
}

export default ContentEditor
