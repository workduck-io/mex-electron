import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useState } from 'react'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction' // FIXME import
import { useCurrentIndex } from '../../../hooks/useCurrentIndex'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { SearchType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { ILink } from '../../../types/Types'
import Preview, { PreviewType } from '../Preview'
import SideBar from '../SideBar'
import { ListItemType } from '../SearchResults/types'
import { StyledContent } from './styled'
import { getListItemFromNode } from '../Home/helper'
import { isNewILink } from '../../../components/mex/NodeSelect/NodeSelect'
import { useSearch } from '../Home/useSearch'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { MAX_RECENT_ITEMS } from '../Home/components/List'
import { initActions } from '../../../data/Actions'
import { mog } from '../../../utils/lib/helper'

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
  const [recentLimit, setRecentLimit] = useState(0)
  const setNormalMode = useSpotlightAppStore((store) => store.setNormalMode)
  const currentListItem = useSpotlightEditorStore((store) => currentListItem)

  // * Custom hooks
  // const currentIndex = 0 // useCurrentIndex(searchResults)
  const { search, selection, setSearch, activeIndex } = useSpotlightContext()
  const { loadNodeAndAppend, loadNodeProps, loadNode } = useLoad()

  useEffect(() => {
    setSaved(false)
    loadNodeProps(editorNode)
    saveEditorNode(editorNode)

    // if (search.value) {
    //   setSearch({ value: '', type: SearchType.search })
    //   setSearchResults([])
    // }
  }, [selection, editorNode, setSearchResults])

  useEffect(() => {
    if (!currentListItem) {
      if (search.value) {
        const listWithNew = searchInList()
        setSearchResults(listWithNew)
      } else {
        setNormalMode(true)
        const recentList = recents.map((nodeid: string) => {
          const item = ilinks.find((link) => link?.nodeid === nodeid)

          const listItem: ListItemType = getListItemFromNode(item)
          return listItem
        })

        const recentLimit = recentList.length < MAX_RECENT_ITEMS ? recentList.length : MAX_RECENT_ITEMS
        setRecentLimit(recentLimit)
        const data = [...recentList.slice(0, recentLimit), ...initActions]
        setSearchResults(data)
      }
    }

    setSaved(false)
  }, [search.value, currentListItem, ilinks])

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
      <SideBar recentLimit={recentLimit} index={activeIndex} data={searchResults} />
      {/* <Preview preview={preview} node={editorNode} /> */}
    </StyledContent>
  )
}

export default Content
