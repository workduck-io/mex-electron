import React, { useEffect } from 'react'

import { SpotlightModals } from '@components/layouts/Modals'
import { isParent } from '@components/mex/Sidebar/treeUtils'
import { DRAFT_NODE, DRAFT_PREFIX } from '@data/Defaults/idPrefixes'
import { getLatestContent } from '@hooks/useEditorBuffer'
import { useSearchExtra } from '@hooks/useSearch'
import { getTodayTaskNodePath, useTaskFromSelection } from '@hooks/useTaskFromSelection'
import useMultipleEditors from '@store/useEditorsStore'
import 'react-contexify/dist/ReactContexify.css'
import { ErrorBoundary } from 'react-error-boundary'

import EditorErrorFallback from '../../../components/mex/Error/EditorErrorFallback'
import { BASE_TASKS_PATH, defaultContent } from '../../../data/Defaults/baseData'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction'
import { MeetingSnippetContent } from '../../../data/initial/MeetingNote'
// FIXME import
import { getUntitledDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { getAttendeeUserIDsFromCalendarEvent, useCalendar, useCalendarStore } from '../../../hooks/useCalendar'
import useEditorActions from '../../../hooks/useEditorActions'
import useLoad from '../../../hooks/useLoad'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { AppType } from '../../../types/Types'
import { createNodeWithUid, insertItemInArray, mog } from '../../../utils/lib/helper'
import { QuickLinkType } from '../../mex/NodeSelect/types'
import { useActionsCache } from '../Actions/useActionsCache'
import { MAX_RECENT_ITEMS } from '../Home/components/List'
import { getListItemFromNode } from '../Home/helper'
import { CREATE_NEW_ITEM, CREATE_NEW_TASK_ITEM, useSearch } from '../Home/useSearch'
import Preview, { PreviewType } from '../Preview'
import { ListItemType } from '../SearchResults/types'
import SideBar from '../SideBar'
import { StyledContent } from './styled'

export const INIT_PREVIEW: PreviewType = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
  isSelection: false
}

const Content = () => {
  // * Store
  const ilinks = useDataStore((s) => s.ilinks)
  const lastOpenedNodes = useRecentsStore((store) => store.lastOpened)
  const recentResearchNodes = useRecentsStore((store) => store.recentResearchNodes)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const { getNewTaskNode, getNewTaskContent } = useTaskFromSelection()
  const { getUpcomingEvents } = useCalendar()
  const { editorNode, setNodeContent, setPreviewEditorNode, preview, setPreview } = useSpotlightEditorStore(
    (store) => ({
      editorNode: store.node,
      saveEditorNode: store.setNode,
      setNodeContent: store.setNodeContent,
      loadNode: store.loadNode,
      preview: store.preview,
      setPreview: store.setPreview,
      setPreviewEditorNode: store.setNode
    })
  )

  // * Custom hooks
  const { getNode } = useLoad()
  const { searchInList } = useSearch()
  const { resetEditor } = useEditorActions()
  const { getSearchExtra } = useSearchExtra()
  const { search, selection, activeItem, activeIndex, searchResults, setSearchResults } = useSpotlightContext()
  const events = useCalendarStore((store) => store.events)
  const actions = useActionsCache((store) => store.actions)
  const pinned = useMultipleEditors((store) => store.pinned)

  const getRecentList = (noteIds: Array<string>, limit = MAX_RECENT_ITEMS) => {
    const recentList: Array<ListItemType> = []

    const extra = getSearchExtra()
    const pinned = useMultipleEditors.getState().pinned
    const ilinks = useDataStore.getState().ilinks

    noteIds.forEach((noteId) => {
      if (!pinned.has(noteId)) {
        const noteLink = ilinks.find((noteLink) => noteLink.nodeid === noteId)

        if (noteLink && !isParent(noteLink.path, BASE_TASKS_PATH)) {
          const item = getListItemFromNode(noteLink, { searchRepExtra: extra })
          recentList.push(item)
        }
      }
    })

    if (recentList.length > limit) {
      return recentList.slice(0, limit)
    }

    return recentList
  }

  const getPinnedItems = () => {
    const pinnedItems: Array<ListItemType> = []

    const pinned = useMultipleEditors.getState().pinned
    const ilinks = useDataStore.getState().ilinks

    pinned.forEach((pinnedNoteId) => {
      const noteLink = ilinks.find((noteLink) => noteLink.nodeid === pinnedNoteId)
      const item = getListItemFromNode(noteLink, { categoryType: CategoryType.pinned })
      pinnedItems.push(item)
    })

    return pinnedItems
  }

  // * For setting the results
  useEffect(() => {
    async function getSearchItems() {
      if (!activeItem?.item) {
        if (search.value) {
          const listWithNew = await searchInList()
          setSearchResults(listWithNew)
        } else {
          if (!normalMode) return

          const upcomingGoogleEvent = selection ? [] : getUpcomingEvents()
          const notesOpened = selection ? recentResearchNodes : lastOpenedNodes

          const pinned = getPinnedItems()
          const recents = getRecentList(notesOpened).reverse()

          const listWithNew = insertItemInArray(recents, CREATE_NEW_ITEM, 1)
          const listItems = selection ? [...listWithNew.slice(0, 2), CREATE_NEW_TASK_ITEM()] : listWithNew

          const results = [...upcomingGoogleEvent, ...pinned, ...listItems, ...actions]
          setSearchResults(results)
        }
      }
    }

    if (normalMode) getSearchItems()
  }, [search.value, actions, selection, activeItem.item, normalMode, pinned, ilinks, events])

  // * For setting the preview
  useEffect(() => {
    const resultNode = searchResults[activeIndex]
    const isNode = resultNode?.type === QuickLinkType.backlink
    const isMeeting = resultNode?.category === CategoryType.meeting
    const isNewTask = resultNode?.category === CategoryType.task
    let nodeid: string

    if (isNode && !activeItem.active) {
      const isNew = resultNode?.extras?.new
      const val = search.type === CategoryType.backlink ? search.value.slice(2) : search.value

      const nodeValue = val || getUntitledDraftKey()

      let node

      if (isNew) {
        if (editorNode.title !== `${DRAFT_PREFIX}.${DRAFT_NODE}`) {
          node = createNodeWithUid(nodeValue)
        }
      } else {
        node = getNode(resultNode?.id ?? '')
      }

      if (node) {
        nodeid = node.nodeid
        setPreviewEditorNode(node)
      }
    }

    if (isMeeting && !activeItem.active) {
      if (resultNode?.extras.nodeid !== undefined) {
        const node = getNode(resultNode?.extras.nodeid ?? '')

        nodeid = node.nodeid
        setPreviewEditorNode(node)
      }
    }

    if (isNewTask && !activeItem.active) {
      const node = getNewTaskNode(false) ?? {
        nodeid: undefined,
        path: getTodayTaskNodePath()
      }

      nodeid = node ? node.nodeid : undefined

      // mog('NewTaskNode', { node })
      setPreviewEditorNode({
        ...node,
        title: node?.path,
        id: nodeid
      })
    }

    if (selection) {
      // mog('Using selection for preview')
      setPreview({
        ...selection,
        isSelection: true
      })
    } else {
      if (nodeid && useSpotlightAppStore.getState().normalMode) {
        const e = resultNode?.extras.event
        const meetingContent = MeetingSnippetContent({
          title: e?.summary,
          date: e?.times?.start,
          link: e?.links?.meet ?? e?.links?.event,
          attendees: getAttendeeUserIDsFromCalendarEvent(e)
        })
        const content = getLatestContent(nodeid) ?? (isMeeting ? meetingContent : defaultContent.content)
        setNodeContent(content)
        setPreview(INIT_PREVIEW)
      } else if (isNewTask) {
        mog('NewTaskContent is used here')
        const content = getNewTaskContent()
        setNodeContent(content)
        setPreview(INIT_PREVIEW)
      } else if (isMeeting) {
        const e = resultNode?.extras.event
        const content = MeetingSnippetContent({
          title: e.summary,
          date: e.times.start,
          link: e.links.meet ?? e.links.event,
          attendees: getAttendeeUserIDsFromCalendarEvent(e)
        })
        setNodeContent(content)
        setPreview(INIT_PREVIEW)
      }
    }
  }, [search.value, activeIndex, activeItem, selection, searchResults])

  return (
    <StyledContent>
      <SideBar data={searchResults} />
      <SpotlightModals />
      <ErrorBoundary onReset={() => resetEditor(AppType.SPOTLIGHT)} FallbackComponent={EditorErrorFallback}>
        <Preview preview={preview} nodeId={editorNode.nodeid} />
      </ErrorBoundary>
    </StyledContent>
  )
}

export default Content
