import { isParent } from '@components/mex/Sidebar/treeUtils'
import { DRAFT_NODE, DRAFT_PREFIX } from '@data/Defaults/idPrefixes'
import { getTodayTaskNodePath, useTaskFromSelection } from '@hooks/useTaskFromSelection'
import React, { useEffect } from 'react'
import 'react-contexify/dist/ReactContexify.css'
import { ErrorBoundary } from 'react-error-boundary'
import EditorErrorFallback from '../../../components/mex/Error/EditorErrorFallback'
import { BASE_TASKS_PATH, defaultContent } from '../../../data/Defaults/baseData'
import { MeetingSnippetContent } from '../../../data/initial/MeetingNote'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction' // FIXME import
import { getUntitledDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { useCalendar, useCalendarStore } from '../../../hooks/useCalendar'
import useEditorActions from '../../../hooks/useEditorActions'
import { AppType } from '../../../hooks/useInitialize'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { createNodeWithUid, insertItemInArray, mog } from '../../../utils/lib/helper'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import { useActionStore } from '../Actions/useActionStore'
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
  const { search, selection, activeItem, activeIndex, searchResults, setSearchResults } = useSpotlightContext()
  const events = useCalendarStore((store) => store.events)
  const actions = useActionStore((store) => store.actions)

  // * For setting the results
  useEffect(() => {
    async function getSearchItems() {
      if (!activeItem?.item) {
        if (search.value) {
          const listWithNew = await searchInList()
          setSearchResults(listWithNew)
        } else {
          // * Get those recent node links which exists locally

          if (!normalMode) return

          const recentEvents = selection ? [] : getUpcomingEvents()
          mog('EVENTS', { recentEvents })

          const recents = selection ? recentResearchNodes : lastOpenedNodes
          const items = recents.filter((recent: string) => ilinks.find((ilink) => ilink.nodeid === recent))

          const recentList = items
            .map((nodeid: string) => {
              const item = ilinks.find((link) => link?.nodeid === nodeid)

              const listItem: ListItemType = getListItemFromNode(item)
              return listItem
            })
            .filter((item) => {
              const cond = !isParent(item.extras.path, BASE_TASKS_PATH)
              console.log('cond', { cond })
              return cond
            })
            .reverse()

          const recentLimit = recentList.length < MAX_RECENT_ITEMS ? recentList.length : MAX_RECENT_ITEMS
          const limitedList = recentList.slice(0, recentLimit)
          const listWithNew = insertItemInArray(limitedList, CREATE_NEW_ITEM, 1)
          const listWithAllNew = selection ? insertItemInArray(listWithNew, CREATE_NEW_TASK_ITEM(), 2) : listWithNew
          const defItems = selection ? [CREATE_NEW_ITEM, CREATE_NEW_TASK_ITEM()] : [CREATE_NEW_ITEM]

          const list = !recentLimit ? defItems : listWithAllNew

          const data = [...recentEvents, ...list, ...actions]
          setSearchResults(data)
        }
      }
    }

    if (normalMode) getSearchItems()

    // else {
    //   setSearchResults([activeItem.item])
    // }
  }, [search.value, actions, selection, activeItem.item, normalMode, ilinks, events])

  // * For setting the preview
  useEffect(() => {
    const resultNode = searchResults[activeIndex]
    const isNode = resultNode?.type === QuickLinkType.backlink
    const isMeeting = resultNode?.category === CategoryType.meeting
    const isNewTask = resultNode?.category === CategoryType.task
    let nodeid

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
      setPreview({
        ...selection,
        isSelection: true
      })
    } else {
      if (nodeid && useSpotlightAppStore.getState().normalMode) {
        const e = resultNode?.extras.event
        const meetingContent = MeetingSnippetContent(e?.summary, e?.times?.start, e?.links?.meet ?? e?.links?.event)
        const content =
          useContentStore.getState().getContent(nodeid)?.content ??
          (isMeeting ? meetingContent : defaultContent.content)
        setNodeContent(content)
        setPreview(INIT_PREVIEW)
      } else if (isNewTask) {
        const content = getNewTaskContent()
        setNodeContent(content)
        setPreview(INIT_PREVIEW)
      } else if (isMeeting) {
        const e = resultNode?.extras.event
        const content = MeetingSnippetContent(e.summary, e.times.start, e.links.meet ?? e.links.event)
        setNodeContent(content)
        setPreview(INIT_PREVIEW)
      }
    }
  }, [search.value, activeIndex, activeItem, selection, searchResults])

  return (
    <StyledContent>
      <SideBar data={searchResults} />
      <ErrorBoundary onReset={() => resetEditor(AppType.SPOTLIGHT)} FallbackComponent={EditorErrorFallback}>
        <Preview preview={preview} nodeId={editorNode.nodeid} />
      </ErrorBoundary>
    </StyledContent>
  )
}

export default Content
