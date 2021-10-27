import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import messageIcon from '@iconify-icons/ri/message-3-line'
import focusLine from '@iconify-icons/ri/focus-line'
import settings4Line from '@iconify-icons/ri/settings-4-line'
import React, { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import tinykeys from 'tinykeys'
import { useHelpStore } from '../Components/Help/HelpModal'
import NodeIntentsModal, { useNodeIntentsModalStore } from '../Components/NodeIntentsModal/NodeIntentsModal'
import useLoad from '../Hooks/useLoad/useLoad'
import { useLayoutStore } from '../Layout/LayoutStore'
import useLayout from '../Layout/useLayout'
import IconButton from '../Styled/Buttons'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor'
import Loading from '../Styled/Loading'
import { SaverButton } from './Components/Saver'
import Editor from './Editor'
import { useEditorStore } from './Store/EditorStore'
import useToggleElements from '../Hooks/useToggleElements/useToggleElements'
import { useKeyListener } from '../Hooks/useCustomShortcuts/useShortcutListener'

const ContentEditor = () => {
  const title = useEditorStore((state) => state.node.title)
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const nodeIntentsModalOpen = useNodeIntentsModalStore((store) => store.open)
  const nodeIntentsModalToggle = useNodeIntentsModalStore((store) => store.toggleModal)
  const { loadNode } = useLoad()

  const { showGraph, showSyncBlocks, toggleSyncBlocks, toggleGraph } = useToggleElements()

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

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
  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) toggleFocusMode()
      },
      [shortcuts.refreshNode.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) loadNode(uid)
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const onSave = () => {
    // console.log('OnSave')
    // Callback after save
  }

  // console.log('Content Editor', { uid, content, title })

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <NodeInfo focusMode={focusMode}>
          <NoteTitle>{title}</NoteTitle>
          {fetchingContent && <Loading dots={3} />}
          <InfoTools>
            <IconButton size={24} icon={focusLine} title="Focus Mode" highlight={focusMode} onClick={toggleFocusMode} />
            <IconButton
              size={24}
              icon={settings4Line}
              title="Node Intents"
              highlight={nodeIntentsModalOpen}
              onClick={nodeIntentsModalToggle}
            />
            <SaverButton callbackAfterSave={onSave} />
            <IconButton
              size={24}
              icon={messageIcon}
              title="Sync Blocks"
              highlight={showSyncBlocks}
              onClick={toggleSyncBlocks}
            />
            <IconButton size={24} icon={bubbleChartLine} title="Graph" highlight={showGraph} onClick={toggleGraph} />
          </InfoTools>
        </NodeInfo>

        <Editor showBalloonToolbar readOnly={fetchingContent} content={content} editorId={uid} />
      </StyledEditor>
      <NodeIntentsModal uid={uid} />
    </>
  )
}

export default ContentEditor
