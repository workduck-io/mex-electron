import { useViewStore, View } from '@hooks/useTaskViews'
import trashIcon from '@iconify/icons-codicon/trash'
import { Icon } from '@iconify/react'
import { ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@ui/components/menus/contextMenu'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { useTaskViewModalStore } from '@components/mex/TaskViewModal'
import fileCopyLine from '@iconify/icons-ri/file-copy-line'
import React from 'react'

interface TaskViewContextMenuProps {
  view: View<any>
}

const TaskViewContextMenu = ({ view }: TaskViewContextMenuProps) => {
  const removeView = useViewStore((store) => store.removeView)
  const openModal = useTaskViewModalStore((store) => store.openModal)
  const setCurrentView = useViewStore((store) => store.setCurrentView)
  const { goTo } = useRouting()

  const handleDelete = async (view: View<any>) => {
    const currentView = useViewStore.getState().currentView
    removeView(view.id)
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
            handleClone(view)
          }}
        >
          <Icon icon={fileCopyLine} />
          Clone
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          color="#df7777"
          onSelect={(args) => {
            handleDelete(view)
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
