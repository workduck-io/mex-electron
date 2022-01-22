import React, { useEffect, useMemo } from 'react'
import tinykeys from 'tinykeys'
import shallow from 'zustand/shallow'
import { useHelpStore } from '../store/useHelpStore'
import Metadata from '../components/mex/Metadata/Metadata'
import NodeIntentsModal from '../components/mex/NodeIntentsModal/NodeIntentsModal'
import { defaultContent } from '../data/Defaults/baseData'
import { useKeyListener } from '../hooks/useShortcutListener'
import useLoad from '../hooks/useLoad'
import { useNavigation } from '../hooks/useNavigation'
// import { useQStore } from '../store/useQStore'
import useToggleElements from '../hooks/useToggleElements'
import useLayout from '../hooks/useLayout'
import { getEditorId } from '../utils/lib/EditorId'
import { StyledEditor } from '../style/Editor'
// import { NodeContent } from '../types/data'
// import { useDataSaverFromContent } from './Components/Saver'
import Editor from './Editor'
import { useEditorStore } from '../store/useEditorStore'
import { useContentStore } from '../store/useContentStore'
import Toolbar from './Toolbar'
import { mog } from '../utils/lib/helper'
import { useEditorBuffer } from '../hooks/useEditorBuffer'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()

  const { showGraph } = useToggleElements()

  const { uid, node, fsContent } = useEditorStore(
    (state) => ({ uid: state.node.uid, node: state.node, fsContent: state.content }),
    shallow
  )

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutHandler } = useKeyListener()

  const { move } = useNavigation()

  // const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  // const add2Q = useQStore((s) => s.add2Q)

  const getContent = useContentStore((state) => state.getContent)

  const { addOrUpdateValBuffer, getBufferVal } = useEditorBuffer()

  const onChangeSave = (val: any[]) => {
    mog('Trigger onChange', { node, val })
    if (val && node && node.uid !== '__null__') {
      // console.log('Saving onChange', { node, val })

      // add2Q(node.uid)
      addOrUpdateValBuffer(node.uid, val)
      // saveEditorValueAndUpdateStores(node, val, false)
    }
  }

  const editorId = useMemo(
    () =>
      getEditorId(
        node.uid,
        // fsContent.metadata?.updatedAt?.toString() ?? 'not_updated',
        fetchingContent
      ),
    [node, fetchingContent]
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
          const node = useEditorStore.getState().node
          const val = getBufferVal(node.uid)
          console.log('Refreshing: ', { node, val })
          saveApiAndUpdate(node, val)
          // fetchAndSaveNode(useEditorStore.getState().node)
          // loadNode(uid, { fetch: true, savePrev: false })
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

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
