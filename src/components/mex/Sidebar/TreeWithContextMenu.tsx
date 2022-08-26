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
import volumeDownLine from '@iconify/icons-ri/volume-down-line'
import { mog } from '@utils/lib/helper'
import { useTemplateModalStore } from '../Template/TemplateModalStore'
import toast from 'react-hot-toast'

export const MENU_ID = 'Tree-Menu'

interface MuteMenuItemProps {
  nodeid: string
  lastOpenedState: LastOpenedState
}

export const MuteMenuItem = ({ nodeid, lastOpenedState }: MuteMenuItemProps) => {
  const { muteNode, unmuteNode } = useLastOpened()

  const isMuted = useMemo(() => {
    if (nodeid === 'NODE_WQgXbba9aBJV6X8ckDWp6') {
      mog('isMuted for special', { lastOpenedState, nodeid })
    }
    return lastOpenedState === LastOpenedState.MUTED
  }, [nodeid, lastOpenedState])

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
  const openTemplateModal = useTemplateModalStore((store) => store.openModal)

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

  const handleTemplate = (item: TreeItem) => {
    if (item.data.path !== 'Drafts') {
      openTemplateModal(item.data.nodeid)
    } else {
      toast.error('Template cannot be set for Drafts hierarchy')
    }
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
            handleTemplate(item)
          }}
        >
          <Icon icon="carbon:template" />
          {/* TODO: unable to make the following line conditional based on metadata, sometimes works */}
          Set Template
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
        <MuteMenuItem nodeid={item.data.nodeid} lastOpenedState={item.data.lastOpenedState} />
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
