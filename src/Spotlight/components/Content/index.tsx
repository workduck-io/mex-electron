import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import useDataStore from '../../../Editor/Store/DataStore'
import useLoad from '../../../Hooks/useLoad/useLoad'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { DEFAULT_PREVIEW_TEXT } from '../../utils/constants'
import { useSpotlightContext } from '../../utils/context'
import { useCurrentIndex } from '../../utils/hooks'
import Preview from '../Preview'
import SideBar from '../SideBar'
import { ILink } from '../../../Editor/Store/Types'
import { useSpotlightAppStore } from '../../../Spotlight/store/app'
import { createNodeWithUid } from '../../../Lib/helper'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import { isNew } from '../../../Components/NodeSelect/NodeSelect'

export const StyledContent = styled.section`
  display: flex;
  flex: 1;
  max-height: 324px;
  margin: 0.5rem 0;
`

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
  const { ilinks } = useDataStore(({ ilinks }) => ({ ilinks }))
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

  const { normalMode, setNormalMode } = useSpotlightAppStore(({ normalMode, setNormalMode }) => ({
    normalMode,
    setNormalMode
  }))

  // useEffect(() => {
  //   if (!normalMode) {
  //     setNormalMode(true)
  //     saveEditorNode(createNodeWithUid(getNewDraftKey()))
  //   }
  // }, [])

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
  }, [selection, setSearchResults])

  useEffect(() => {
    const results = getSearchResults(search, ilinks, { keySelector: (obj) => obj.key })

    if (search) {
      const resultsWithContent: Array<Partial<ILink> | { desc: string; new?: boolean }> = results.map(
        (ilink: ILink) => {
          const content = getContent(ilink.uid)
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

      const isNew = ilinks.filter((item) => item.text === search).length === 0

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
        loadNodeAndAppend(resultNode.uid, nodeContent)
      } else {
        loadNode(resultNode.uid, { savePrev: false, fetch: false })
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
