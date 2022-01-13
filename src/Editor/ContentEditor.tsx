import React, { useEffect, useMemo } from 'react'
import tinykeys from 'tinykeys'
import shallow from 'zustand/shallow'
import { useHelpStore } from '../Components/Help/HelpModal'
import Metadata from '../Components/Metadata/Metadata'
import NodeIntentsModal from '../Components/NodeIntentsModal/NodeIntentsModal'
import { defaultContent } from '../Defaults/baseData'
import { useKeyListener } from '../Hooks/useCustomShortcuts/useShortcutListener'
import useLoad from '../Hooks/useLoad/useLoad'
import { useNavigation } from '../Hooks/useNavigation/useNavigation'
import { useQStore } from '../Hooks/useQ'
import useToggleElements from '../Hooks/useToggleElements/useToggleElements'
import useLayout from '../Layout/useLayout'
import { getEditorId } from '../Lib/EditorId'
import { StyledEditor } from '../Styled/Editor'
import { NodeContent } from '../Types/data'
import { useDataSaverFromContent } from './Components/Saver'
import Editor from './Editor'
import { useEditorStore } from './Store/EditorStore'
import Toolbar from './Toolbar'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { fetchAndSaveNode } = useLoad()

  const { showGraph } = useToggleElements()

  const { uid, node, fsContent } = useEditorStore(
    (state) => ({ uid: state.node.uid, node: state.node, fsContent: state.content }),
    shallow
  )

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  const { move } = useNavigation()

  const { saveEditorAndUpdateStates } = useDataSaverFromContent()
  const add2Q = useQStore((s) => s.add2Q)

  const onChangeSave = (val: any[]) => {
    console.log('Trigger onChange', { node, val })
    if (val && node && node.uid !== '__null__') {
      // console.log('Saving onChange', { node, val })

      add2Q(node.uid)
      saveEditorAndUpdateStates(node, val, false)
    }
  }

  const editorId = useMemo(
    () => getEditorId(node.uid, fsContent.version ?? 0, fetchingContent),
    [node, fetchingContent, fsContent.version]
  )

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
          fetchAndSaveNode(useEditorStore.getState().node)
          // loadNode(uid, { fetch: true, savePrev: false })
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
          content={fsContent?.content ?? defaultContent.content}
          onChange={onChangeSave}
          editorId={editorId}
        />
      </StyledEditor>
      <NodeIntentsModal uid={uid} />
    </>
  )
}

export default ContentEditor
