import checkboxLine from '@iconify/icons-ri/checkbox-line'
import fileDocument from '@iconify/icons-gg/file-document'
import appsLine from '@iconify/icons-ri/apps-line'
import quillPenLine from '@iconify/icons-ri/quill-pen-line'
import searchLine from '@iconify/icons-ri/search-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { NavLinkData } from '../components/mex/Sidebar/Types'
import { useEditorStore } from '../store/useEditorStore'
import { useHelpStore } from '../store/useHelpStore'
import { ROUTE_PATHS } from '../views/routes/urls'

/*
Sidebar links are defined here
*/

// Disabled as IconifyIcon type doesn't work
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const GetIcon = (icon: any): React.ReactNode => <Icon width="32" icon={icon} />

const useNavlinks = () => {
  const shortcuts = useHelpStore((store) => store.shortcuts)
  const nodeid = useEditorStore((store) => store.node.nodeid)

  const getLinks = () => {
    const links: NavLinkData[] = [
      {
        title: 'Search',
        path: ROUTE_PATHS.search,
        shortcut: shortcuts.showSearch.keystrokes,
        icon: GetIcon(searchLine)
      },
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
      },

      {
        title: 'Snippets',
        path: ROUTE_PATHS.snippets,
        shortcut: shortcuts.showSnippets.keystrokes,
        icon: GetIcon(quillPenLine)
      },
      {
        title: 'Tasks',
        path: ROUTE_PATHS.tasks,
        icon: GetIcon(checkboxLine),
        shortcut: shortcuts.showTasks.keystrokes
        // isComingSoon: true
      },

      {
        title: 'Flows',
        path: ROUTE_PATHS.integrations,
        // shortcut: shortcuts.showIntegrations.keystrokes,
        icon: GetIcon(appsLine),
        isComingSoon: true
      }
    ]
    return links
  }

  return { getLinks }
}

export default useNavlinks
