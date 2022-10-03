import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import fileDocument from '@iconify/icons-gg/file-document'
import appsLine from '@iconify/icons-ri/apps-line'

import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { NavLinkData } from '../components/mex/Sidebar/Types'
import { useHelpStore } from '../store/useHelpStore'
import { ROUTE_PATHS } from '../views/routes/urls'
import { useMatch } from 'react-router-dom'
import { useEditorStore } from '@store/useEditorStore'
import { useViewStore } from '@hooks/useTaskViews'

/*
Sidebar links are defined here
*/

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const GetIcon = (icon: any): React.ReactNode => <Icon icon={icon} />

const useNavlinks = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)

  /* Find current note if available */
  const matchNodePath = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const nodeid = matchNodePath?.params?.nodeid || useEditorStore.getState().node.nodeid

  /* Find current view if available */
  const matchViewPath = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const viewid = matchViewPath?.params?.viewid || useViewStore.getState().currentView?.id

  // const count = useMemo(() => getLinkCount(), [reminders, ilinks, archive, tasks])

  const getLinks = () => {
    const links: NavLinkData[] = [
      // {
      //   title: 'Search',
      //   path: ROUTE_PATHS.search,
      //   shortcut: shortcuts.showSearch.keystrokes,
      //   icon: GetIcon(searchLine)
      // },
      // {
      //   title: 'Actions',
      //   path: ROUTE_PATHS.actions,
      //   // shortcut: shortcuts.showIntegrations.keystrokes,
      //   icon: GetIcon(actionIcon)
      // },
      // {
      //   title: 'Actions',
      //   path: ROUTE_PATHS.actions,
      //   // shortcut: shortcuts.showIntegrations.keystrokes,
      //   icon: GetIcon(actionIcon)
      // },
      // {
      //   title: 'Dashboard',
      //   path: ROUTE_PATHS.dashborad,
      //   icon: GetIcon(dashboardLine),
      //   isComingSoon: true
      // },
      {
        title: 'Notes',
        path: `${ROUTE_PATHS.node}/${nodeid}`,
        shortcut: shortcuts.showEditor.keystrokes,
        icon: GetIcon(fileDocument)
        // count: count.notes
      },

      {
        title: 'Snippets',
        path: ROUTE_PATHS.snippets,
        shortcut: shortcuts.showSnippets.keystrokes,
        icon: GetIcon(quillPenLine)
        // count: count.snippets
      },
      {
        title: 'Tasks',
        path: viewid ? `${ROUTE_PATHS.tasks}/${viewid}` : ROUTE_PATHS.tasks,
        icon: GetIcon(checkboxLine),
        shortcut: shortcuts.showTasks.keystrokes
        // count: count.tasks
        // isComingSoon: true
      },
      {
        title: 'Reminders',
        path: ROUTE_PATHS.reminders,
        icon: GetIcon(timerFlashLine),
        // count: count.reminders
        shortcut: shortcuts.showReminder.keystrokes
        // isComingSoon: true
      },

      {
        title: 'Integrations',
        path: ROUTE_PATHS.integrations,
        shortcut: shortcuts.showIntegrations.keystrokes,
        icon: GetIcon(appsLine)
      }
    ]
    return links
  }

  return { getLinks }
}

export default useNavlinks
