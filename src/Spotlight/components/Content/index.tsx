import { search as getSearchResults } from 'fast-fuzzy'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { DEFAULT_PREVIEW_TEXT, IpcAction } from '../../utils/constants'
import { useSpotlightContext } from '../../utils/context'
import { useCurrentIndex } from '../../utils/hooks'
import Preview from '../Preview'
import SideBar from '../SideBar'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { getNewDraftKey } from '../../../Editor/Components/SyncBlock/getNewBlockData'
import useDataStore from '../../../Editor/Store/DataStore'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import Recent from '../Recent'
import { useRecentsStore } from '../../../Editor/Store/RecentsStore'
import { appNotifierWindow } from '../../../Spotlight/utils/notifiers'
import { AppType } from '../../../Data/useInitialize'

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
  const { search, selection } = useSpotlightContext()
  const recents = useRecentsStore((state) => state.lastOpened)
  const clearRecents = useRecentsStore((state) => state.clear)

  const [data, setData] = useState<Array<any>>()
  const ilinks = useDataStore((s) => s.ilinks)
  const draftKey = useMemo(() => getNewDraftKey(), [])

  const [preview, setPreview] = useState<{
    text: string
    metadata: string | null
    isSelection: boolean
  }>(initPreview)
  const currentIndex = useCurrentIndex(data, search)
  const getContent = useContentStore((state) => state.getContent)

  const { loadNodeAndAppend, loadNodeFromId } = useEditorStore(({ loadNodeAndAppend, loadNodeFromId }) => ({
    loadNodeAndAppend,
    loadNodeFromId
  }))
  const { setSaved } = useContentStore(({ setSaved }) => ({ setSaved }))
  const nodeContent = useSpotlightEditorStore((state) => state.nodeContent)

  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)

  useEffect(() => {
    setSaved(false)
    loadNodeFromId(draftKey)
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
          isSelection: true
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
        loadNodeFromId(contentKey.key)
      }
    }
    setSaved(false)
  }, [data, currentIndex, selection])

  const handleClearClick = () => {
    clearRecents()
    appNotifierWindow(IpcAction.CLEAR_RECENTS, AppType.SPOTLIGHT)
  }

  return (
    <StyledContent>
      {selection || search ? (
        <Preview preview={preview} nodeId={draftKey} />
      ) : (
        <Recent recents={recents} onClearClick={handleClearClick} />
      )}
      <SideBar index={currentIndex} data={data} />
    </StyledContent>
  )
}

export default Content
