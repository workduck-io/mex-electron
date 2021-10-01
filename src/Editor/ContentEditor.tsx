import settings4Line from '@iconify-icons/ri/settings-4-line'
import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import React, { useEffect, useState } from 'react'
import ReactTooltip from 'react-tooltip'
import useLayout from '../Layout/useLayout'
import { useGraphStore } from '../Components/Graph/GraphStore'
import IconButton from '../Styled/Buttons'
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor'
import { SaverButton } from './Components/Saver'
import Editor from './Editor'
import { useEditorStore } from './Store/EditorStore'
import { useLayoutStore } from '../Layout/LayoutStore'
import focusLine from '@iconify-icons/ri/focus-line'
import tinykeys from 'tinykeys'
import { useHelpStore } from '../Components/Help/HelpModal'
import NodeIntentsModal, { useNodeIntentsModalStore } from '../Components/NodeIntentsModal/NodeIntentsModal'

const ContentEditor = () => {
  const title = useEditorStore((state) => state.node.title)
  const showGraph = useGraphStore((state) => state.showGraph)
  const toggleGraph = useGraphStore((state) => state.toggleGraph)
  const { toggleFocusMode } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const nodeIntentsModalOpen = useNodeIntentsModalStore((store) => store.open)
  const nodeIntentsModalToggle = useNodeIntentsModalStore((store) => store.toggleModal)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const id = useEditorStore((state) => state.node.id)
  const fsContent = useEditorStore((state) => state.content)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
    }
  }, [fsContent, id])

  const shortcuts = useHelpStore((store) => store.shortcuts)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.toggleFocusMode.keystrokes]: (event) => {
        event.preventDefault()
        toggleFocusMode()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, toggleFocusMode])

  const onSave = () => {
    console.log('OnSave')

    // Callback after save
  }

  return (
    <>
      <StyledEditor showGraph={showGraph} className="mex_editor">
        <NodeInfo focusMode={focusMode}>
          <NoteTitle>{title}</NoteTitle>
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
              icon={bubbleChartLine}
              title="Graph"
              highlight={showGraph}
              onClick={() => toggleGraph()}
            />
          </InfoTools>
        </NodeInfo>

        <Editor showBalloonToolbar content={content} editorId={id} />
      </StyledEditor>
      <NodeIntentsModal id={id} />
    </>
  )
}

export default ContentEditor
