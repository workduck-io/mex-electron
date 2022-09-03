import { useShareModalStore } from '@components/mex/Mention/ShareModalStore'
import focusLine from '@iconify/icons-ri/focus-line'
import shareLine from '@iconify/icons-ri/share-line'
import { useSingleton } from '@tippyjs/react'
import React from 'react'
import BookmarkButton from '../components/mex/Buttons/BookmarkButton'
import useLayout from '../hooks/useLayout'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { useLayoutStore } from '../store/useLayoutStore'
import { InfoTools, NodeInfo } from '../style/Editor'
import Loading from '../style/Loading'
import NodeRenameOnlyTitle from './Components/Toolbar/NodeRename'
import { IconButton, ToolbarTooltip } from '@workduck-io/mex-components'
// import NodeRenameTitle from './Components/Toolbar/NodeRenameTitle'

const Toolbar = () => {
  const fetchingContent = useEditorStore((state) => state.fetchingContent)
  const { toggleFocusMode, getFocusProps } = useLayout()
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
    <NodeInfo>
      <NodeRenameOnlyTitle />
      {fetchingContent && <Loading transparent dots={3} />}
      <InfoTools {...getFocusProps(focusMode)}>
        <ToolbarTooltip singleton={source} />
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
      </InfoTools>
    </NodeInfo>
  )
}

export default Toolbar
