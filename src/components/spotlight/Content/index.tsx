import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useContentStore } from '../../../store/useContentStore'
import useDataStore from '../../../store/useDataStore'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction' // FIXME import
import { useCurrentIndex } from '../../../hooks/useCurrentIndex'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightContext } from '../../../store/Context/context.spotlight'
import { ILink } from '../../../types/Types'
import Preview from '../Preview'
import SideBar from '../SideBar'
import { StyledContent } from './styled'

const initPreview = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
  isSelection: false
}

const Content = () => {
  // * State
  const [searchResults, setSearchResults] = useState<Array<any>>()
  const [preview, setPreview] = useState<{
    text: string
    metadata: string | null
    isSelection: boolean
  }>(initPreview)

  // * Store
  const ilinks = useDataStore((s) => s.ilinks)
  const { setSaved, getContent } = useContentStore(({ setSaved, getContent }) => ({ setSaved, getContent }))
  const { editorNode, saveEditorNode, setNodeContent, nodeContent, isPreview } = useSpotlightEditorStore(
    ({ node, setNode, setNodeContent, nodeContent, isPreview }) => ({
      editorNode: node,
      saveEditorNode: setNode,
      setNodeContent,
      nodeContent,
      isPreview
    })
  )

  const setNormalMode = useSpotlightAppStore((s) => s.setNormalMode)

  // * Custom hooks
  const { search, selection, setSearch } = useSpotlightContext()
  const currentIndex = useCurrentIndex(searchResults)
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
    const results = getSearchResults(search, ilinks, { keySelector: (obj) => obj.path })

    if (search) {
      const resultsWithContent: Array<Partial<ILink> | { desc: string; new?: boolean }> = results.map(
        (ilink: ILink) => {
          const content = getContent(ilink.nodeid)
          let rawText = ''

          content?.content.map((item) => {
            rawText += item?.children?.[0]?.text || ''
            return item
          })

          return {
            ...ilink,
            desc: rawText
          }
        }
      )

      const isNew = ilinks.filter((item) => item.path === search).length === 0

      if (isNew) {
        setSearchResults([{ new: true }, ...resultsWithContent])
      } else {
        setSearchResults(resultsWithContent)
      }
    } else {
      setNormalMode(true)
      setSearchResults(undefined)
    }
    setSaved(false)
  }, [search, ilinks])

  useEffect(() => {
    const prevTemplate = {
      text: DEFAULT_PREVIEW_TEXT,
      metadata: null,
      isSelection: false
    }

    if (!searchResults) {
      if (selection) {
        setPreview({
          ...selection,
          isSelection: true
        })
      } else {
        setNodeContent(undefined)
        setPreview(prevTemplate)
      }
    } else if (searchResults.length === 0) {
      setPreview({
        ...prevTemplate,
        text: null
      })
      loadNodeProps(editorNode)
    } else {
      const resultNode = searchResults[currentIndex]
      setPreview({
        ...prevTemplate,
        text: null
      })
      if (nodeContent) {
        loadNodeAndAppend(resultNode.nodeid, nodeContent)
      } else {
        loadNode(resultNode.nodeid, { savePrev: false, fetch: false })
      }
    }
    setSaved(false)
  }, [searchResults, currentIndex, isPreview, selection, editorNode])

  return (
    <StyledContent>
      <SideBar index={currentIndex} data={searchResults} />
      <Preview preview={preview} node={editorNode} />
    </StyledContent>
  )
}

export default Content
