import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useState } from 'react'
import { convertContentToRawText } from '../../../utils/search/localSearch'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction' // FIXME import
import { useCurrentIndex } from '../../../hooks/useCurrentIndex'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import { ILink } from '../../../types/Types'
import Preview, { PreviewType } from '../Preview'
import SideBar from '../SideBar'
import { ListItemType } from '../SearchResults/types'
import { StyledContent } from './styled'

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

  const { setSaved, getContent } = useContentStore((store) => ({
    setSaved: store.setSaved,
    getContent: store.getContent
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
  const currentIndex = useCurrentIndex(searchResults)
  const { search, selection, setSearch } = useSpotlightContext()
  const { loadNodeAndAppend, loadNodeProps, loadNode } = useLoad()

  useEffect(() => {
    setSaved(false)
    loadNodeProps(editorNode)
    saveEditorNode(editorNode)

    if (search) {
      setSearch('')
      setSearchResults(undefined)
    }
  }, [selection, editorNode, setSearchResults])

  useEffect(() => {
    // * Search in
    const listToSearch = ilinks
    const resultList = getSearchResults(search, listToSearch, { keySelector: (obj) => obj.path })

    if (search) {
      const result: Array<ListItemType> = resultList.map((ilink: ILink) => {
        const content = getContent(ilink.nodeid)
        const rawText = convertContentToRawText(content?.content ?? [], ' ')

        const listItem: ListItemType = {
          icon: ilink.icon,
          title: ilink.path,
          description: rawText,
          type: 'ilink',
          extras: {
            nodeid: ilink.nodeid,
            path: ilink.path
          },
          new: false,
          shortcut: ['Enter']
        }

        return listItem
      })

      const isNew = ilinks.filter((item) => item.path === search).length === 0
      const listWithNew = isNew ? [{ new: true }, ...result] : result
      setSearchResults(listWithNew)
    } else {
      setNormalMode(true)
      setSearchResults(undefined)
    }

    setSaved(false)
  }, [search, ilinks])

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
