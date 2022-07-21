import { useViewStore, View } from '@hooks/useTaskViews'
import trashIcon from '@iconify/icons-codicon/trash'
import { Icon } from '@iconify/react'
import { ContextMenuContent, ContextMenuItem } from '@ui/components/menus/contextMenu'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import React from 'react'

interface TaskViewContextMenuProps {
  view: View<any>
}

const TaskViewContextMenu = ({ view }: TaskViewContextMenuProps) => {
  const removeView = useViewStore((store) => store.removeView)
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

  return (
    <>
      <ContextMenuContent>
        {/* <ContextMenuItem
          onSelect={(args) => {
            handleUnarchive(item)
          }}
        >
          <Icon icon={unarchiveLine} />
          Unarchive
        </ContextMenuItem>
        <ContextMenuSeparator /> */}
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
