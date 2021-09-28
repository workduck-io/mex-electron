import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { DEFAULT_PREVIEW_TEXT } from '../../utils/constants'
import { useSpotlightContext } from '../../utils/context'
import { useCurrentIndex } from '../../utils/hooks'
import Preview from '../Preview'
import SideBar from '../SideBar'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '../../../Editor/Store/DataStore'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'
import useLoad from '../../../Hooks/useLoad/useLoad'

export const StyledContent = styled.section`
  display: flex;
  flex: 1;
  max-height: 290px;
  margin: 0.5rem 0;
`

const initPreview = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
  isSelection: false
}

const Content = () => {
  const previewId = useSpotlightEditorStore((state) => state.nodeId)
  const backPressed = useSpotlightSettingsStore((state) => state.backPressed)
  const { search, selection } = useSpotlightContext()

  const draftKey = useMemo(() => {
    const key = getNewDraftKey()

    if (backPressed) {
      return previewId
    }

    return key
  }, [backPressed])

  const [data, setData] = useState<Array<any>>()
  const [preview, setPreview] = useState<{
    text: string
    metadata: string | null
    isSelection: boolean
  }>(initPreview)

  const currentIndex = useCurrentIndex(data, search)

  const ilinks = useDataStore((s) => s.ilinks)
  const getContent = useContentStore((state) => state.getContent)

  const { loadNodeAndAppend, loadNode } = useLoad()

  const saveEditorId = useSpotlightEditorStore((state) => state.setNodeId)
  const { setSaved } = useContentStore(({ setSaved }) => ({ setSaved }))
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)
  const isPreview = useSpotlightEditorStore((state) => state.isPreview)

  useEffect(() => {
    setSaved(false)
    loadNode(draftKey)
    saveEditorId(draftKey)
  }, [selection])

  useEffect(() => {
    const results = getSearchResults(search, ilinks, { keySelector: (obj) => obj.key })
    if (search) {
      const resultsWithContent = results.map((result) => {
        const content = getContent(result.key)
        let rawText = ''

        content?.content.map((item) => {
          rawText += item?.children?.[0]?.text || ''
          return item
        })

        return {
          ...result,
          desc: rawText
        }
      })
      setData(resultsWithContent)
    } else {
      setData(undefined)
    }
    setSaved(false)
  }, [search, ilinks])

  useEffect(() => {
    const prevTemplate = {
      text: DEFAULT_PREVIEW_TEXT,
      metadata: null,
      isSelection: false
    }

    if (!data) {
      if (selection) {
        setPreview({
          ...selection,
          isSelection: isPreview
        })
      } else {
        setNodeContent(undefined)
        setPreview(prevTemplate)
      }
    } else if (data.length === 0) {
      setPreview({
        ...prevTemplate,
        text: null
      })
    } else {
      const contentKey = data[currentIndex]
      setPreview({
        ...prevTemplate,
        text: null
      })
      if (nodeContent) {
        loadNodeAndAppend(contentKey.key, nodeContent)
      } else {
        loadNode(contentKey.key)
      }
    }
    setSaved(false)
  }, [data, currentIndex, isPreview, selection])

  return (
    <StyledContent>
      <Preview preview={preview} nodeId={draftKey} />
      <SideBar index={currentIndex} data={data} />
    </StyledContent>
  )
}

export default Content
