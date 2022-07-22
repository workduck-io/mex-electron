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
import { useMatch } from 'react-router-dom'
import SnippetList from './SnippetList'
import { usePolling } from '@apis/usePolling'
import { mog } from '@utils/lib/helper'
import ArchiveSidebar from './ArchiveSidebar'
import TaskViewList from './TaskViewList'

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
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isSnippetNote = useMatch(`${ROUTE_PATHS.snippet}/:snippetid`)
  const isSnippet = useMatch(ROUTE_PATHS.snippets)
  const isArchiveEditor = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)
  const isArchive = useMatch(ROUTE_PATHS.archive)
  const isTasks = useMatch(ROUTE_PATHS.tasks)
  const isTasksView = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)

  mog('IS SIDEBAR', { sidebar, isSnippet, isTasks, isSnippetNote, isEditor, isArchive })

  if (!sidebar.show) return <></>

  if (isEditor) return <NodeSidebar />

  if (isSnippet || isSnippetNote) return <SnippetList />

  if (isArchive || isArchiveEditor) return <ArchiveSidebar />

  if (isTasks || isTasksView) return <TaskViewList />

  return <></>
}

export default SidebarTabs
