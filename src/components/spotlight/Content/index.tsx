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

const INIT_PREVIEW: PreviewType = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
  isSelection: false
}

const Content = () => {
  // * State
  const [preview, setPreview] = useState<PreviewType>(INIT_PREVIEW)
  const [searchResults, setSearchResults] = useState<Array<Partial<ListItemType>>>()

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

  const setNormalMode = useSpotlightAppStore((store) => store.setNormalMode)

  // * Custom hooks
  const currentIndex = 0 // useCurrentIndex(searchResults)
  const { search, selection, setSearch } = useSpotlightContext()
  const { loadNodeAndAppend, loadNodeProps, loadNode } = useLoad()

  useEffect(() => {
    setSaved(false)
    loadNodeProps(editorNode)
    saveEditorNode(editorNode)

    if (search) {
      setSearch({ value: '', type: SearchType.search })
      setSearchResults(undefined)
    }
  }, [selection, editorNode, setSearchResults])

  useEffect(() => {
    // * Search in
    const list = ilinks
    const resultList = getSearchResults(search.value, list, { keySelector: (obj) => obj.path })

    if (search.value) {
      const result: Array<ListItemType> = resultList.map((ilink: ILink) => {
        const item: ListItemType = getListItemFromNode(ilink)
        return item
      })

      const isNew = isNewILink(search.value, ilinks)
      const listWithNew = isNew ? [{ id: 'create-new-ilink', extras: { new: true } }, ...result] : result

      setSearchResults(listWithNew)
    } else {
      setNormalMode(true)
      setSearchResults(undefined)
    }

    setSaved(false)
  }, [search.value, ilinks])

  useEffect(() => {
    if (!searchResults) {
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
      const resultNode = searchResults[currentIndex]
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
  }, [searchResults, currentIndex, isPreview, selection, editorNode])

  return (
    <StyledContent>
      <SideBar index={currentIndex} data={searchResults} />
      {/* <Preview preview={preview} node={editorNode} /> */}
    </StyledContent>
  )
}

export default Content
