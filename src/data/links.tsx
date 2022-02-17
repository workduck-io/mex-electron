import fileDocument from '@iconify-icons/gg/file-document'
import appsLine from '@iconify-icons/ri/apps-line'
import searchLine from '@iconify-icons/ri/search-line'
import dashboardLine from '@iconify-icons/ri/dashboard-line'
import quillPenLine from '@iconify-icons/ri/quill-pen-line'
import { Icon } from '@iconify/react'
import React from 'react'
import { NavLinkData } from '../components/mex/Sidebar/Types'
import { useHelpStore } from '../store/useHelpStore'
import { ROUTE_PATHS } from '../views/routes/urls'
import { useEditorStore } from '../store/useEditorStore'

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
        path: `/${ROUTE_PATHS.search}`,
        shortcut: shortcuts.showSearch.keystrokes,
        icon: GetIcon(searchLine)
      },
      {
        title: 'Dashboard',
        path: `/${ROUTE_PATHS.dashborad}`,
        icon: GetIcon(dashboardLine),
        isComingSoon: true
      },
      {
        title: 'Editor',
        path: `/${ROUTE_PATHS.node}/${nodeid}`,
        shortcut: shortcuts.showEditor.keystrokes,
        icon: GetIcon(fileDocument)
      },
      // {
      //   title: 'Tasks',
      //   path: ROUTE_PATHS.tasks,
      //   icon: GetIcon(checkboxLine),
      //   isComingSoon: true
      // },
      {
        title: 'Integrations',
        path: `/${ROUTE_PATHS.integrations}`,
        shortcut: shortcuts.showIntegrations.keystrokes,
        icon: GetIcon(appsLine)
      },
      {
        title: 'Snippets',
        path: `/${ROUTE_PATHS.snippets}`,
        shortcut: shortcuts.showSnippets.keystrokes,
        icon: GetIcon(quillPenLine)
      }
    ]
    return links
  }

  return { getLinks }
}

export default useNavlinks
