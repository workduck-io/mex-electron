import timerFlashLine from '@iconify/icons-ri/timer-flash-line'
import checkboxLine from '@iconify/icons-ri/checkbox-line'
import fileDocument from '@iconify/icons-gg/file-document'
import appsLine from '@iconify/icons-ri/apps-line'

import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import React, { useMemo } from 'react'
import { NavLinkData } from '../components/mex/Sidebar/Types'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { ROUTE_PATHS } from '../views/routes/urls'
import { useLinks } from '../hooks/useLinks'
import { useReminderStore } from '../hooks/useReminders'
import useDataStore from '../store/useDataStore'
import useTodoStore from '../store/useTodoStore'
import { useLocation, useMatch } from 'react-router-dom'

/*
Sidebar links are defined here
*/

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const GetIcon = (icon: any): React.ReactNode => <Icon icon={icon} />

const useNavlinks = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)
  // const nodeid = useEditorStore((store) => store.node.nodeid)
  // const reminders = useReminderStore((store) => store.reminders)
  // const ilinks = useDataStore((store) => store.ilinks)
  // const archive = useDataStore((store) => store.archive)
  // const tasks = useTodoStore((store) => store.todos)
  // const { getLinkCount } = useLinks()

  const match = useMatch(`${ROUTE_PATHS.node}/:nodeid`)

  // const count = useMemo(() => getLinkCount(), [reminders, ilinks, archive, tasks])

  const getLinks = () => {
    const links: NavLinkData[] = [
      {
        title: 'Search',
        path: ROUTE_PATHS.search,
        shortcut: shortcuts.showSearch.keystrokes,
        icon: GetIcon(searchLine)
      },
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
        path: `${ROUTE_PATHS.node}/${match?.params?.nodeid}`,
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
        path: ROUTE_PATHS.tasks,
        icon: GetIcon(checkboxLine),
        shortcut: shortcuts.showTasks.keystrokes
        // count: count.tasks
        // isComingSoon: true
      },
      {
        title: 'Reminders',
        path: ROUTE_PATHS.reminders,
        icon: GetIcon(timerFlashLine)
        // count: count.reminders
        // shortcut: shortcuts.showReminder.keystrokes
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
