import Tabs, { SidebarTab, SingleTabType, TabType } from '@components/layouts/Tabs'
import React, { useMemo, useState } from 'react'
import { PollActions, useApiStore } from '@store/useApiStore'
import { MexIcon } from '@style/Layouts'
import { TreeContainer } from './Tree'
import { SharedNodeIcon } from '@components/icons/Icons'
import SharedNotes from './SharedNotes'
import Bookmarks from './Bookmarks'
import { useTheme } from 'styled-components'
import { useLayoutStore } from '@store/useLayoutStore'
import { ROUTE_PATHS } from '@views/routes/urls'
import { useLocation } from 'react-router-dom'
import SnippetList from './SnippetList'
import { usePolling } from '@apis/usePolling'

const NodeSidebar = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const [openedTab, setOpenedTab] = useState<SingleTabType>(SidebarTab.hierarchy)
  const replaceAndAddActionToPoll = useApiStore((store) => store.replaceAndAddActionToPoll)
  const theme = useTheme()

  const tabs: Array<TabType> = useMemo(
    () => [
      {
        label: <MexIcon noHover icon="ri:draft-line" width={24} height={24} />,
        type: SidebarTab.hierarchy,
        component: <TreeContainer />,
        tooltip: 'All Notes'
      },
      {
        label: <SharedNodeIcon fill={theme.colors.text.default} height={22} width={22} />,
        component: <SharedNotes />,
        type: SidebarTab.shared,
        tooltip: 'Shared Notes'
      },
      {
        label: <MexIcon noHover icon="ri:bookmark-line" width={24} height={24} />,
        type: SidebarTab.bookmarks,
        component: <Bookmarks />,
        tooltip: 'Bookmarks'
      }
    ],
    [theme]
  )

  usePolling()

  return (
    <Tabs
      visible={sidebar.expanded}
      openedTab={openedTab}
      onChange={(tab) => {
        setOpenedTab(tab)
        replaceAndAddActionToPoll(tab as PollActions)
      }}
      tabs={tabs}
    />
  )
}

const SidebarTabs = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const location = useLocation()

  const isEditor = useMemo(() => {
    if (location.pathname) {
      if (location.pathname.startsWith(ROUTE_PATHS.node)) {
        return true
      }
    }
    return false
  }, [location])

  return <>{sidebar.show && (isEditor ? <NodeSidebar /> : <SnippetList />)}</>
}

export default SidebarTabs
