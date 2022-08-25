import { useTaskViews, useViewStore, View } from '@hooks/useTaskViews'
import trashIcon from '@iconify/icons-codicon/trash'
import { Icon } from '@iconify/react'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useTaskViewModalStore } from '@components/mex/TaskViewModal'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import React from 'react'

interface TaskViewContextMenuProps {
  item: View<any>
}

const TaskViewContextMenu = ({ item }: TaskViewContextMenuProps) => {
  // const removeView = useViewStore((store) => store.removeView)
  const openModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()
  const { deleteView } = useTaskViews()

  const handleDelete = async (view: View<any>) => {
    const currentView = useViewStore.getState().currentView
    await deleteView(view.id)
    if (currentView?.id === view.id) {
      setCurrentView(undefined)
      goTo(ROUTE_PATHS.tasks, NavigationType.push)
    }
  }

  const handleClone = (view: View<any>) => {
    openModal({ filters: view.filters, cloneViewId: view.id })
  }

  return (
    <>
      <ContextMenuContent>
        <ContextMenuItem
          onSelect={(args) => {
            handleClone(item)
          }}
        >
          <Icon icon={fileCopyLine} />
          Clone
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

export default TaskViewContextMenu
