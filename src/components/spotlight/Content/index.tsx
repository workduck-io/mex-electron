import React, { useEffect, useState } from 'react'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction' // FIXME import
import useLoad from '../../../hooks/useLoad'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import Preview, { PreviewType } from '../Preview'
import SideBar from '../SideBar'
import { ListItemType } from '../SearchResults/types'
import { StyledContent } from './styled'
import { getListItemFromNode } from '../Home/helper'
import { useSearch } from '../Home/useSearch'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { MAX_RECENT_ITEMS } from '../Home/components/List'
import { initActions } from '../../../data/Actions'
import { mog } from '../../../utils/lib/helper'
import { ErrorBoundary } from 'react-error-boundary'
import useEditorActions from '../../../hooks/useEditorActions'
import EditorErrorFallback from '../../../components/mex/Error/EditorErrorFallback'

const INIT_PREVIEW: PreviewType = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
  isSelection: false
}

const Content = () => {
  // * State
  const [preview, setPreview] = useState<PreviewType>(INIT_PREVIEW)
  const [searchResults, setSearchResults] = useState<Array<ListItemType>>([])
  const recents = useRecentsStore((store) => store.lastOpened)

  const { resetEditor } = useEditorActions()

  // * Store
  const ilinks = useDataStore((s) => s.ilinks)

  const { setSaved } = useContentStore((store) => ({
    setSaved: store.setSaved
  }))

  const { editorNode, saveEditorNode, setNodeContent, nodeContent, isPreview } = useSpotlightEditorStore((store) => ({
    editorNode: store.node,
    saveEditorNode: store.setNode,
    setNodeContent: store.setNodeContent,
    nodeContent: store.nodeContent,
    isPreview: store.isPreview
  }))

  const { searchInList } = useSearch()

  // * Custom hooks
  const { search, selection, activeItem, activeIndex } = useSpotlightContext()
  const { loadNodeAndAppend, loadNodeProps, loadNode } = useLoad()

  useEffect(() => {
    setSaved(false)
    loadNodeProps(editorNode)
    saveEditorNode(editorNode)

    // if (search.value) {
    //   setSearch({ value: '', type: CategoryType.search })
    //   setSearchResults([])
    // }
  }, [selection, editorNode, setSearchResults])

  useEffect(() => {
    if (!activeItem?.item) {
      if (search.value) {
        mog('something', { search })
        const listWithNew = searchInList()
        setSearchResults(listWithNew)
      } else {
        // setNormalMode(true)
        const items = recents.filter((recent: string) => ilinks.find((ilink) => ilink.nodeid === recent))

        const recentList = items.map((nodeid: string) => {
          const item = ilinks.find((link) => link?.nodeid === nodeid)

          const listItem: ListItemType = getListItemFromNode(item)
          return listItem
        })

        const recentLimit = recentList.length < MAX_RECENT_ITEMS ? recentList.length : MAX_RECENT_ITEMS
        // setRecentLimit(recentLimit)
        const data = [...recentList.slice(0, recentLimit), ...initActions]
        setSearchResults(data)
      }
    }

    setSaved(false)
  }, [search.value, activeItem.item, ilinks])

  useEffect(() => {
    if (!search.value) {
      if (selection) {
        setPreview({
          ...selection,
          isSelection: true
        })
      } else {
        setNodeContent(undefined)
        setPreview(INIT_PREVIEW)
      }
    } else if (searchResults.length === 0) {
      setPreview({
        ...INIT_PREVIEW,
        text: null
      })
      loadNodeProps(editorNode)
    } else {
      const resultNode = searchResults[activeIndex]
      setPreview({
        ...INIT_PREVIEW,
        text: null
      })
      if (nodeContent) {
        loadNodeAndAppend(resultNode?.extras?.nodeid, nodeContent)
      } else {
        loadNode(resultNode?.extras?.nodeid, { savePrev: false, fetch: false })
      }
    }
    setSaved(false)
  }, [searchResults, search.value, activeIndex, isPreview, selection, editorNode])

  return (
    <StyledContent>
      <SideBar index={activeIndex} data={searchResults} />
      <ErrorBoundary onReset={resetEditor} FallbackComponent={EditorErrorFallback}>
        <Preview preview={preview} node={editorNode} />
      </ErrorBoundary>
    </StyledContent>
  )
}

export default Content
