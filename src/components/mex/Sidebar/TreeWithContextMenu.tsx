import { TreeItem } from '@atlaskit/tree'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useLastOpened } from '@hooks/useLastOpened'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import editLine from '@iconify/icons-ri/edit-line'
// import refreshFill from '@iconify/icons-ri/refresh-fill'
import volumeMuteLine from '@iconify/icons-ri/volume-mute-line'
import shareLine from '@iconify/icons-ri/share-line'
import { Icon } from '@iconify/react'
// import * as ContextMenu from '@radix-ui/react-context-menu'
//
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import React, { useMemo } from 'react'
import { useShareModalStore } from '../Mention/ShareModalStore'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { useRefactorStore } from '../Refactor/Refactor'
import { LastOpenedState } from '../../../types/userPreference'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import volumeDownLine from '@iconify/icons-ri/volume-down-line'
import { mog } from '@utils/lib/helper'

export const MENU_ID = 'Tree-Menu'

interface MuteMenuItemProps {
  nodeid: string
}

export const MuteMenuItem = ({ nodeid }: MuteMenuItemProps) => {
  const { muteNode, unmuteNode, getLastOpened } = useLastOpened()
  const lastOpenedNote = useUserPreferenceStore((state) => state.lastOpenedNotes[nodeid])

  const isMuted = useMemo(() => {
    const lastOpenedState = getLastOpened(nodeid, lastOpenedNote)
    if (nodeid === 'NODE_WQgXbba9aBJV6X8ckDWp6') {
      const lastOpenedNotes = useUserPreferenceStore.getState().lastOpenedNotes
      const lastOpenedNoteXZ = lastOpenedNotes[nodeid]

      mog('isMuted for special', { lastOpenedState, lastOpenedNote, lastOpenedNotes, nodeid, lastOpenedNoteXZ })
    }
    // mog('isMuted isupdated', { lastOpenedNote, lastOpenedState })
    return lastOpenedState === LastOpenedState.MUTED
  }, [nodeid, lastOpenedNote])

  const handleMute = () => {
    // mog('handleMute', { item })
    if (isMuted) {
      unmuteNode(nodeid)
    } else {
      muteNode(nodeid)
    }
  }

  return (
    <ContextMenuItem
      onSelect={(args) => {
        handleMute()
      }}
    >
      <Icon icon={isMuted ? volumeDownLine : volumeMuteLine} />
      {isMuted ? 'Unmute' : 'Mute'}
    </ContextMenuItem>
  )
}

interface TreeContextMenuProps {
  item: TreeItem
}

export const TreeContextMenu = ({ item }: TreeContextMenuProps) => {
  const prefillRefactorModal = useRefactorStore((store) => store.prefillModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNote } = useCreateNewNote()
  const openShareModal = useShareModalStore((store) => store.openModal)
  // const lastOpenedNote = lastOpenedNotes[nodeId] ?? undefined

  const handleRefactor = (item: TreeItem) => {
    prefillRefactorModal(item?.data?.path)
    // openRefactorModal()
  }

  const handleArchive = (item: TreeItem) => {
    openDeleteModal(item.data.path)
  }

  const handleCreateChild = (item: TreeItem) => {
    // mog('handleCreateChild', { item })
    createNewNote({ parent: item.data.path })
  }

  const handleShare = (item: TreeItem) => {
    openShareModal('permission', item.data.nodeid)
  }

  return (
    <>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={(args) => {
            handleRefactor(item)
          }}
        >
          <Icon icon={editLine} />
          Refactor
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={(args) => {
            handleCreateChild(item)
          }}
        >
          <Icon icon={addCircleLine} />
          New Note
        </ContextMenuItem>
        <ContextMenuItem
          onSelect={(args) => {
            handleShare(item)
          }}
        >
          <Icon icon={shareLine} />
          Share
        </ContextMenuItem>
        <ContextMenuSeparator />
        <MuteMenuItem nodeid={item.data.nodeid} />
        {/* <ContextMenuItem>
          <Icon icon={refreshFill} />
          Sync
        </ContextMenuItem>
         */}

        <ContextMenuItem
          color="#df7777"
          onSelect={(args) => {
            handleArchive(item)
          }}
        >
          <Icon icon={archiveLine} />
          Archive
        </ContextMenuItem>
      </ContextMenuContent>
    </>
  )
}
