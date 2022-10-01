import React from 'react'

import { useTaskViewModalStore } from '@components/mex/TaskViewModal'
import { useTaskViews, useViewStore, View } from '@hooks/useTaskViews'
import trashIcon from '@iconify/icons-codicon/trash'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import { Icon } from '@iconify/react'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import { mog } from '@utils/lib/helper'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'

import { SidebarListItem } from './SidebarList.types'

interface TaskViewContextMenuProps {
  item: SidebarListItem<View>
}

const TaskViewContextMenu = ({ item }: TaskViewContextMenuProps) => {
  // const removeView = useViewStore((store) => store.removeView)
  const openModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()
  const { deleteView } = useTaskViews()

  const handleDelete = async (view: View) => {
    const currentView = useViewStore.getState().currentView
    await deleteView(view.id)
    if (currentView?.id === view.id) {
      setCurrentView(undefined)
      goTo(ROUTE_PATHS.tasks, NavigationType.push)
    }
  }

  const handleClone = (view: View) => {
    openModal({ filters: view.filters, cloneViewId: view.id })
  }

  return (
    <>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={(args) => {
            mog('What what', { item })
            handleClone(item.data)
          }}
        >
          <Icon icon={fileCopyLine} />
          Clone
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          color="#df7777"
          onSelect={(args) => {
            mog('What what', { item })
            handleDelete(item.data)
          }}
        >
          <Icon icon={trashIcon} />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </>
  )
}

export default TaskViewContextMenu
