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
import { LastOpenedState } from '../../../types/userProperties'
import { useUserPropertiesStore } from '@store/userPropertiesStore'
import volumeDownLine from '@iconify/icons-ri/volume-down-line'

interface TreeContextMenuProps {
  item: TreeItem
}

export const MENU_ID = 'Tree-Menu'

export const TreeContextMenu = ({ item }: TreeContextMenuProps) => {
  const prefillRefactorModal = useRefactorStore((store) => store.prefillModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNote } = useCreateNewNote()
  const openShareModal = useShareModalStore((store) => store.openModal)
  const { muteNode, unmuteNode, getLastOpened } = useLastOpened()
  const lastOpenedNote = useUserPropertiesStore((state) => state.lastOpenedNotes[item.data.nodeid])
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

  const isMuted = useMemo(() => {
    const lastOpenedState = getLastOpened(item.data.nodeid, lastOpenedNote)
    // mog('isMuted isupdated', { lastOpenedNote, lastOpenedState })
    return lastOpenedState === LastOpenedState.MUTED
  }, [item.data.nodeid, lastOpenedNote])

  const handleMute = (item: TreeItem) => {
    // mog('handleMute', { item })
    if (isMuted) {
      unmuteNode(item.data.nodeid)
    } else {
      muteNode(item.data.nodeid)
    }
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
        <ContextMenuItem
          onSelect={(args) => {
            handleMute(item)
          }}
        >
          <Icon icon={isMuted ? volumeDownLine : volumeMuteLine} />
          {isMuted ? 'Unmute' : 'Mute'}
        </ContextMenuItem>
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
