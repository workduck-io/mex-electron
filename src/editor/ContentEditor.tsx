import { useSuggestions } from '@components/mex/Suggestions/useSuggestions'
import { selectEditor, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect, useMemo, useRef } from 'react'
import tinykeys from 'tinykeys'
import shallow from 'zustand/shallow'
import Metadata from '../components/mex/Metadata/Metadata'
import { defaultContent } from '../data/Defaults/baseData'
import { useEditorBuffer } from '../hooks/useEditorBuffer'
import useLayout from '../hooks/useLayout'
import useLoad from '../hooks/useLoad'
import { useKeyListener } from '../hooks/useShortcutListener'
import { useAnalysisTodoAutoUpdate } from '../store/useAnalysis'
import useBlockStore from '../store/useBlockStore'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { useLayoutStore } from '../store/useLayoutStore'
import { EditorWrapper, StyledEditor } from '../style/Editor'
import { getEditorId } from '../utils/lib/EditorId'
import BlockInfoBar from './Components/Blocks/BlockInfoBar'
import { useComboboxOpen } from './Components/combobox/hooks/useComboboxOpen'
import { BlockOptionsMenu } from './Components/EditorContextMenu'
import Editor from './Editor'
import Toolbar from './Toolbar'

import { useNodes } from '@hooks/useNodes'
import { useApi } from '@apis/useSaveApi'
import { getContent } from '@utils/helpers'
import { areEqual } from '@utils/lib/hash'
import toast from 'react-hot-toast'

const ContentEditor = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const setIsEditing = useEditorStore((store) => store.setIsEditing)
  const { toggleFocusMode } = useLayout()
  const { saveApiAndUpdate } = useLoad()
  const { accessWhenShared } = useNodes()

  const { getDataAPI } = useApi()
  const isBlockMode = useBlockStore((store) => store.isBlockMode)
  const isComboOpen = useComboboxOpen()

  const infobar = useLayoutStore((store) => store.infobar)

  const editorWrapperRef = useRef<HTMLDivElement>(null)

  const { node, fsContent } = useEditorStore(
    (state) => ({ nodeid: state.node.nodeid, node: state.node, fsContent: state.content }),
    shallow
  )

  const { shortcutHandler } = useKeyListener()
  const { getSuggestions } = useSuggestions()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const editorRef = usePlateEditorRef()
  const { addOrUpdateValBuffer, getBufferVal, saveAndClearBuffer } = useEditorBuffer()

  const onChangeSave = async (val: any[]) => {
    if (val && node && node.nodeid !== '__null__') {
      setIsEditing(false)
      addOrUpdateValBuffer(node.nodeid, val)
    }
  }

  const editorId = useMemo(() => getEditorId(node.nodeid, false), [node, fetchingContent])

  const onFocusClick = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()

    if (editorRef) {
      if (editorWrapperRef.current) {
        const el = editorWrapperRef.current
        const hasScrolled = el.scrollTop > 0
        // mog('ElScroll', { hasScrolled })
        if (!hasScrolled) {
          selectEditor(editorRef, { focus: true })
        }
      }
    }
  }

  useAnalysisTodoAutoUpdate()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
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
          const val = getBufferVal(node.nodeid)
          const content = getContent(node.nodeid)
          const res = areEqual(content.content, val)

          if (!res) {
            saveApiAndUpdate(node, val)
          } else {
            // * If buffer hasn't changed, refresh the note
            getDataAPI(node.nodeid, false, true)
          }
        })
      },
      [shortcuts.save.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.refreshNode, () => {
          saveAndClearBuffer()
          toast('Saved!')
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const viewOnly = accessWhenShared(node.nodeid) === 'READ'
  const readOnly = !!fetchingContent

  return (
    <>
      <StyledEditor showGraph={infobar.mode === 'graph'} className="mex_editor">
        <Toolbar />

        {isBlockMode ? <BlockInfoBar /> : <Metadata node={node} />}

        <EditorWrapper comboboxOpen={isComboOpen} ref={editorWrapperRef} onClick={onFocusClick}>
          <Editor
            getSuggestions={getSuggestions}
            showBalloonToolbar
            onAutoSave={(val) => {
              saveAndClearBuffer(false)
            }}
            content={fsContent?.content?.length ? fsContent?.content : defaultContent.content}
            onChange={onChangeSave}
            editorId={editorId}
            readOnly={viewOnly}
          />
        </EditorWrapper>
      </StyledEditor>
      <BlockOptionsMenu blockId="one" />
      {/* <NodeIntentsModal nodeid={nodeid} /> */}
    </>
  )
}

export default ContentEditor
