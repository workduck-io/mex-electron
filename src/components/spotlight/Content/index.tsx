import { CREATE_NEW_ITEM, useSearch } from '../Home/useSearch'
import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { ItemActionType, ListItemType } from '../SearchResults/types'
import Preview, { PreviewType } from '../Preview'
import React, { useEffect } from 'react'
import { createNodeWithUid, insertItemInArray } from '../../../utils/lib/helper'

import { AppType } from '../../../hooks/useInitialize'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction' // FIXME import
import EditorErrorFallback from '../../../components/mex/Error/EditorErrorFallback'
import { ErrorBoundary } from 'react-error-boundary'
import { MAX_RECENT_ITEMS } from '../Home/components/List'
import SideBar from '../SideBar'
import { StyledContent } from './styled'
import { defaultContent } from '../../../data/Defaults/baseData'
import { getListItemFromNode } from '../Home/helper'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { initActions } from '../../../data/Actions'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import useEditorActions from '../../../hooks/useEditorActions'
import useLoad from '../../../hooks/useLoad'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'
import 'react-contexify/dist/ReactContexify.css'

export const INIT_PREVIEW: PreviewType = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
  isSelection: false
}

const Content = () => {
  // * Store
  const ilinks = useDataStore((s) => s.ilinks)
  const lastOpenedNodes = useRecentsStore((store) => store.lastOpened)
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const recentResearchNodes = useRecentsStore((store) => store.recentResearchNodes)
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

  // * For setting the results
  useEffect(() => {
    if (!activeItem?.item) {
      if (search.value) {
        const listWithNew = searchInList()
        setSearchResults(listWithNew)
      } else {
        // * Get those recent node links which exists locally
        const recents = selection ? recentResearchNodes : lastOpenedNodes
        const items = recents.filter((recent: string) => ilinks.find((ilink) => ilink.nodeid === recent))

        const recentList = items
          .map((nodeid: string) => {
            const item = ilinks.find((link) => link?.nodeid === nodeid)

            const listItem: ListItemType = getListItemFromNode(item)
            return listItem
          })
          .reverse()

        const recentLimit = recentList.length < MAX_RECENT_ITEMS ? recentList.length : MAX_RECENT_ITEMS
        const limitedList = recentList.slice(0, recentLimit)

        const list = !recentLimit ? [CREATE_NEW_ITEM] : insertItemInArray(limitedList, CREATE_NEW_ITEM, 1)
        const data = [...list, ...initActions]
        setSearchResults(data)
      }
    }
    // else {
    //   setSearchResults([activeItem.item])
    // }
  }, [search.value, selection, activeItem.item, ilinks])

  // * For setting the preview
  useEffect(() => {
    const resultNode = searchResults[activeIndex]
    const isNode = resultNode?.type === QuickLinkType.ilink

    if (isNode && !activeItem.active) {
      const isNew = resultNode?.extras?.new
      const val = search.type === CategoryType.quicklink ? search.value.slice(2) : search.value

      const nodeValue = val || getNewDraftKey()
      const node = isNew ? createNodeWithUid(nodeValue) : getNode(resultNode?.id ?? '')
      setPreviewEditorNode(node)
    }

    if (selection) {
      setPreview({
        ...selection,
        isSelection: true
      })
    } else {
      const content = useContentStore.getState().getContent(resultNode?.id)?.content ?? defaultContent.content
      setNodeContent(content)
      setPreview(INIT_PREVIEW)
    }
  }, [search.value, activeIndex, activeItem, selection, normalMode, searchResults])

  return (
    <StyledContent>
      <SideBar data={searchResults} />
      <ErrorBoundary onReset={() => resetEditor(AppType.SPOTLIGHT)} FallbackComponent={EditorErrorFallback}>
        {/* <PreviewRenderer /> */}
        <Preview preview={preview} nodeId={editorNode.nodeid} />
      </ErrorBoundary>
    </StyledContent>
  )
}

export default Content
