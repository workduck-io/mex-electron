import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import focusLine from '@iconify-icons/ri/focus-line'
import messageIcon from '@iconify-icons/ri/message-3-line'
import settings4Line from '@iconify-icons/ri/settings-4-line'
import { useSingleton } from '@tippyjs/react'
import React from 'react'
import BookmarkButton from '../Components/Buttons/BookmarkButton'
import { useNodeIntentsModalStore } from '../Components/NodeIntentsModal/NodeIntentsModal'
import { ToolbarTooltip } from '../Components/Tooltips'
import useToggleElements from '../Hooks/useToggleElements/useToggleElements'
import { useLayoutStore } from '../Layout/LayoutStore'
import useLayout from '../Layout/useLayout'
import IconButton from '../Styled/Buttons'
import { InfoTools, NodeInfo } from '../Styled/Editor'
import Loading from '../Styled/Loading'
import NodeRenameTitle from './Components/NodeRenameTitle'
import { SaverButton } from './Components/Saver'
import { useEditorStore } from './Store/EditorStore'

const Toolbar = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const nodeIntentsModalOpen = useNodeIntentsModalStore((store) => store.open)
  const nodeIntentsModalToggle = useNodeIntentsModalStore((store) => store.toggleModal)
  const uid = useEditorStore((state) => state.node.uid)
  const [source, target] = useSingleton()

  const { showGraph, showSyncBlocks, toggleSyncBlocks, toggleGraph } = useToggleElements()

  const onSave = () => {
    // console.log('onsave')
    // callback after save
  }

  return (
    <NodeInfo focusMode={focusMode}>
      <NodeRenameTitle />
      {/* <NoteTitle>{title}</NoteTitle> */}
      {fetchingContent && <Loading dots={3} />}
      <InfoTools>
        <ToolbarTooltip singleton={source} />
        <ToolbarTooltip singleton={target} content="Bookmark">
          <span tabIndex={0}>
            <BookmarkButton uid={uid} />
          </span>
        </ToolbarTooltip>
        <IconButton
          singleton={target}
          size={24}
          icon={focusLine}
          title="Focus Mode"
          highlight={focusMode}
          onClick={toggleFocusMode}
        />
        <IconButton
          size={24}
          singleton={target}
          icon={settings4Line}
          title="Node Intents"
          highlight={nodeIntentsModalOpen}
          onClick={nodeIntentsModalToggle}
        />
        <SaverButton singleton={target} callbackAfterSave={onSave} />
        <IconButton
          size={24}
          singleton={target}
          icon={messageIcon}
          title="Sync Blocks"
          highlight={showSyncBlocks}
          onClick={toggleSyncBlocks}
        />
        <IconButton
          singleton={target}
          size={24}
          icon={bubbleChartLine}
          title="Graph"
          highlight={showGraph}
          onClick={toggleGraph}
        />
      </InfoTools>
    </NodeInfo>
  )
}

export default Toolbar
