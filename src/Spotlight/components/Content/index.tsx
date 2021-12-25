import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import useDataStore from '../../../Editor/Store/DataStore'
import useLoad from '../../../Hooks/useLoad/useLoad'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'
import { DEFAULT_PREVIEW_TEXT } from '../../utils/constants'
import { useSpotlightContext } from '../../utils/context'
import { useCurrentIndex } from '../../utils/hooks'
import Preview from '../Preview'
import SideBar from '../SideBar'
import { NODE_ID_PREFIX } from '../../../Defaults/idPrefixes'
import { nanoid } from 'nanoid'
import { ILink } from '../../../Editor/Store/Types'

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

export const createNodeWithUid = (key: string) => ({
  title: key,
  id: key,
  uid: `${NODE_ID_PREFIX}${nanoid()}`,
  key: key
})

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

  // * Custom hooks
  const { search, selection, setEditSearchedNode } = useSpotlightContext()
  const currentIndex = useCurrentIndex(searchResults)
  const { loadNodeAndAppend, loadNodeProps, loadNode } = useLoad()

  const draftNode = useMemo(() => {
    const keyNode = createNodeWithUid(getNewDraftKey())

    // if (backPressed) {
    //   return editorNode
    // }

    return keyNode
  }, [])

  useEffect(() => {
    setSaved(false)
    loadNodeProps(draftNode)
    saveEditorNode(draftNode)
  }, [selection])

  useEffect(() => {
    const results = getSearchResults(search, ilinks, { keySelector: (obj) => obj.key })

    if (search) {
      const resultsWithContent: Array<ILink | { desc: string }> = results.map((ilink: ILink) => {
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
      })
      setSearchResults(resultsWithContent)
    } else {
      setEditSearchedNode(undefined)
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
      loadNodeProps(draftNode)
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
  }, [searchResults, currentIndex, isPreview, selection, draftNode])

  return (
    <StyledContent>
      <SideBar index={currentIndex} data={searchResults} />
      <Preview preview={preview} node={draftNode} />
    </StyledContent>
  )
}

export default Content
