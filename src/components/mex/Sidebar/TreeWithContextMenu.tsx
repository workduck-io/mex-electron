import { TreeItem } from '@atlaskit/tree'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import archiveLine from '@iconify/icons-ri/archive-line'
import editLine from '@iconify/icons-ri/edit-line'
import refreshFill from '@iconify/icons-ri/refresh-fill'
import shareLine from '@iconify/icons-ri/share-line'
import { Icon } from '@iconify/react'
// import * as ContextMenu from '@radix-ui/react-context-menu'
//
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import React from 'react'
import { useShareModalStore } from '../Mention/ShareModalStore'
import { useDeleteStore } from '../Refactor/DeleteModal'
import { useRefactorStore } from '../Refactor/Refactor'

// interface ItemProps {
//   id: string
//   path: string
//   onDisplayMenu: (nodeid: string) => void
// }

interface TreeContextMenuProps {
  item: TreeItem
}

export const MENU_ID = 'Tree-Menu'

export const TreeContextMenu = ({ item }: TreeContextMenuProps) => {
  const openRefactorModal = useRefactorStore((store) => store.openModal)
  const openDeleteModal = useDeleteStore((store) => store.openModal)
  const { createNewNote } = useCreateNewNote()
  const openShareModal = useShareModalStore((store) => store.openModal)

  const handleRefactor = (item: TreeItem) => {
    openRefactorModal()
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
