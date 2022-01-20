import bubbleChartLine from '@iconify-icons/ri/bubble-chart-line'
import focusLine from '@iconify-icons/ri/focus-line'
import messageIcon from '@iconify-icons/ri/message-3-line'
import settings4Line from '@iconify-icons/ri/settings-4-line'
import { useSingleton } from '@tippyjs/react'
import React from 'react'
import BookmarkButton from '../components/mex/Buttons/BookmarkButton'
import { useHelpStore } from '../store/useHelpStore'
import { useNodeIntentsModalStore } from '../components/mex/NodeIntentsModal/NodeIntentsModal'
import { ToolbarTooltip } from '../components/mex/Tooltips'
import useToggleElements from '../hooks/useToggleElements'
import { useLayoutStore } from '../store/useLayoutStore'
import useLayout from '../hooks/useLayout'
import IconButton from '../style/Buttons'
import { InfoTools, NodeInfo } from '../style/Editor'
import Loading from '../style/Loading'
import NodeRenameTitle from './Components/NodeRenameTitle'
import { SaverButton } from './Components/Saver'
import { useEditorStore } from '../store/useEditorStore'

const Toolbar = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const nodeIntentsModalOpen = useNodeIntentsModalStore((store) => store.open)
  const nodeIntentsModalToggle = useNodeIntentsModalStore((store) => store.toggleModal)
  const uid = useEditorStore((state) => state.node.uid)
  const [source, target] = useSingleton()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  const { showGraph, showSyncBlocks, toggleSyncBlocks, toggleGraph } = useToggleElements()

  const onSave = () => {
    // console.log('onsave')
    // callback after save
  }

  return (
    <NodeInfo focusMode={focusMode}>
      <NodeRenameTitle />
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
          shortcut={shortcuts.toggleFocusMode.keystrokes}
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
        <SaverButton
          // saveOnUnmount
          shortcut={shortcuts.save.keystrokes}
          title="Save"
          singleton={target}
          callbackAfterSave={onSave}
        />
        <IconButton
          size={24}
          singleton={target}
          icon={messageIcon}
          shortcut={shortcuts.showSyncBlocks.keystrokes}
          title="Sync Blocks"
          // title="Sync Blocks"
          highlight={showSyncBlocks}
          onClick={toggleSyncBlocks}
        />
        <IconButton
          singleton={target}
          size={24}
          icon={bubbleChartLine}
          shortcut={shortcuts.showGraph.keystrokes}
          title="Graph"
          highlight={showGraph}
          onClick={toggleGraph}
        />
      </InfoTools>
    </NodeInfo>
  )
}

export default Toolbar
