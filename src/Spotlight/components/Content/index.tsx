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

export const createNodeWithUid = (key: string) => ({
  title: key,
  id: key,
  uid: `${NODE_ID_PREFIX}${nanoid()}`,
  key: key
})

const Content = () => {
  const previewNode = useSpotlightEditorStore((state) => state.node)
  const backPressed = useSpotlightSettingsStore((state) => state.backPressed)

  const { search, selection } = useSpotlightContext()

  const draftNode = useMemo(() => {
    const keyNode = createNodeWithUid(getNewDraftKey())

    if (backPressed) {
      return previewNode
    }

    return keyNode
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

  const { loadNodeAndAppend, loadNodeProps, loadNode } = useLoad()

  const saveEditorNode = useSpotlightEditorStore((state) => state.setNode)
  const { setSaved } = useContentStore(({ setSaved }) => ({ setSaved }))
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)
  const isPreview = useSpotlightEditorStore((state) => state.isPreview)

  useEffect(() => {
    setSaved(false)
    loadNodeProps(draftNode)
    saveEditorNode(draftNode)
  }, [selection])

  useEffect(() => {
    const results = getSearchResults(search, ilinks, { keySelector: (obj) => obj.key })
    if (search) {
      const resultsWithContent = results.map((result) => {
        const content = getContent(result.uid)
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
      loadNodeProps(draftNode)
    } else {
      const contentKey = data[currentIndex]
      setPreview({
        ...prevTemplate,
        text: null
      })
      if (nodeContent) {
        loadNodeAndAppend(contentKey.uid, nodeContent)
      } else {
        loadNode(contentKey.uid, { savePrev: false, fetch: false })
      }
    }
    setSaved(false)
  }, [data, currentIndex, isPreview, selection, draftNode])

  return (
    <StyledContent>
      <SideBar index={currentIndex} data={data} />
      <Preview preview={preview} node={draftNode} />
    </StyledContent>
  )
}

export default Content
