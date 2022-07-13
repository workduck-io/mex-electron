import React from 'react'
import { TreeItem } from '@atlaskit/tree'
import trashIcon from '@iconify/icons-codicon/trash'
import unarchiveLine from '@iconify/icons-clarity/unarchive-line'
import { Icon } from '@iconify/react'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import { useDelete } from '@hooks/useDelete'
import useArchive from '@hooks/useArchive'
import toast from 'react-hot-toast'

interface TreeContextMenuProps {
  item: TreeItem
}

export const MENU_ID = 'Tree-Menu'

const ArchiveContextMenu = ({ item }: TreeContextMenuProps) => {
  const { getMockDelete } = useDelete()
  const { removeArchiveData } = useArchive()

  const handleDelete = async (item: TreeItem) => {
    const notesToDelete = getMockDelete(item.data.nodeid)

    try {
      await removeArchiveData(notesToDelete)
    } catch (err) {
      toast('Error deleting Note')
    }
  }

  const handleUnarchive = (item: TreeItem) => {
    // * TODO: Unarchive method
  }

  return (
    <>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={(args) => {
            handleUnarchive(item)
          }}
        >
          <Icon icon={unarchiveLine} />
          Unarchive
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          color="#df7777"
          onSelect={(args) => {
            handleDelete(item)
          }}
        >
          <Icon icon={trashIcon} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </>
  )
}

export default ArchiveContextMenu
