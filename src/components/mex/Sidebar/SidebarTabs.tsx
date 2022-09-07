import { useLayoutStore } from '@store/useLayoutStore'
import { NoteSidebar } from '@ui/sidebar/Sidebar.notes'
import { ROUTE_PATHS } from '@views/routes/urls'
import React from 'react'
import { useMatch } from 'react-router-dom'
import ArchiveSidebar from './ArchiveSidebar'
import SnippetList from './SnippetList'
import TagList from './TagList'
import TaskViewList from './TaskViewList'

const SidebarTabs = () => {
  const sidebar = useLayoutStore((store) => store.sidebar)
  const isEditor = useMatch(`${ROUTE_PATHS.node}/:nodeid`)
  const isSnippetNote = useMatch(`${ROUTE_PATHS.snippet}/:snippetid`)
  const isSnippet = useMatch(ROUTE_PATHS.snippets)
  const isArchiveEditor = useMatch(`${ROUTE_PATHS.archive}/:nodeid`)
  const isArchive = useMatch(ROUTE_PATHS.archive)
  const isTasks = useMatch(ROUTE_PATHS.tasks)
  const isTasksView = useMatch(`${ROUTE_PATHS.tasks}/:viewid`)
  const isTagsView = useMatch(`${ROUTE_PATHS.tag}/:tag`)

  // mog('IS SIDEBAR', { sidebar, isSnippet, isTasks, isSnippetNote, isEditor, isArchive })

  if (!sidebar.show) return <></>

  if (isEditor) return <NoteSidebar />

  if (isSnippet || isSnippetNote) return <SnippetList />

  if (isArchive || isArchiveEditor) return <ArchiveSidebar />

  if (isTasks || isTasksView) return <TaskViewList />

  if (isTagsView) return <TagList />

  return <></>
}

export default SidebarTabs
