import { useShareModalStore } from '@components/mex/Mention/ShareModalStore'
import focusLine from '@iconify/icons-ri/focus-line'
import shareLine from '@iconify/icons-ri/share-line'
import { useSingleton } from '@tippyjs/react'
import React from 'react'
import BookmarkButton from '../components/mex/Buttons/BookmarkButton'
import { ToolbarTooltip } from '../components/mex/Tooltips'
import useLayout from '../hooks/useLayout'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { useLayoutStore } from '../store/useLayoutStore'
import IconButton from '../style/Buttons'
import { InfoTools, NodeInfo } from '../style/Editor'
import Loading from '../style/Loading'
import NodeRenameOnlyTitle from './Components/Toolbar/NodeRename'
// import NodeRenameTitle from './Components/Toolbar/NodeRenameTitle'

const Toolbar = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode, setFocusHover, getFocusProps } = useLayout()
  const focusMode = useLayoutStore((store) => store.focusMode)
  const openShareModal = useShareModalStore((store) => store.openModal)
  const shareModalState = useShareModalStore((store) => store.open)
  // const nodeIntentsModalOpen = useNodeIntentsModalStore((store) => store.open)
  // const nodeIntentsModalToggle = useNodeIntentsModalStore((store) => store.toggleModal)
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const [source, target] = useSingleton()
  const shortcuts = useHelpStore((store) => store.shortcuts)

  // const infobar = useLayoutStore((store) => store.infobar)
  // const { toggleGraph, toggleSuggestedNodes, toggleReminder } = useToggleElements()

  return (
    <NodeInfo {...getFocusProps(focusMode)}>
      <NodeRenameOnlyTitle />
      {fetchingContent && <Loading transparent dots={3} />}
      <InfoTools>
        <ToolbarTooltip singleton={source} />
        <ToolbarTooltip singleton={target} content="Bookmark">
          <span tabIndex={0}>
            <BookmarkButton nodeid={nodeid} />
          </span>
        </ToolbarTooltip>
        <IconButton
          size={24}
          singleton={target}
          transparent={false}
          icon={shareLine}
          title="Share"
          highlight={shareModalState}
          onClick={() => openShareModal('permission')}
        />
        <IconButton
          singleton={target}
          size={24}
          transparent={false}
          icon={focusLine}
          title="Focus Mode"
          shortcut={shortcuts.toggleFocusMode.keystrokes}
          highlight={focusMode.on}
          onClick={toggleFocusMode}
        />
        {/*
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
          title="Flow Links"
          highlight={showSyncBlocks}
          onClick={toggleSyncBlocks}
        />
        <IconButton
          size={24}
          singleton={target}
          icon={timerFlashLine}
          shortcut={shortcuts.showReminder.keystrokes}
          title="Reminders"
          highlight={infobar.mode === 'reminders'}
          onClick={toggleReminder}
        />
        <IconButton
          size={24}
          singleton={target}
          icon={lightbulbFlashLine}
          shortcut={shortcuts.showSuggestedNodes.keystrokes}
          title="Smart Suggestions"
          highlight={infobar.mode === 'suggestions'}
          onClick={toggleSuggestedNodes}
        />
        <IconButton
          singleton={target}
          size={24}
          icon={bubbleChartLine}
          shortcut={shortcuts.showGraph.keystrokes}
          title="Context View"
          highlight={infobar.mode === 'graph'}
          onClick={toggleGraph}
        />
        */}
      </InfoTools>
    </NodeInfo>
  )
}

export default Toolbar
