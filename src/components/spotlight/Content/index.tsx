import { CategoryType, useSpotlightContext } from '../../../store/Context/context.spotlight'
import Preview, { PreviewType } from '../Preview'
import React, { useEffect } from 'react'
import { createNodeWithUid } from '../../../utils/lib/helper'

import { AppType } from '../../../hooks/useInitialize'
import { DEFAULT_PREVIEW_TEXT } from '../../../data/IpcAction' // FIXME import
import EditorErrorFallback from '../../../components/mex/Error/EditorErrorFallback'
import { ErrorBoundary } from 'react-error-boundary'
import SideBar from '../SideBar'
import { StyledContent } from './styled'
import { defaultContent } from '../../../data/Defaults/baseData'
import { getNewDraftKey } from '../../../editor/Components/SyncBlock/getNewBlockData'
import { useContentStore } from '../../../store/useContentStore'
import useEditorActions from '../../../hooks/useEditorActions'
import useLoad from '../../../hooks/useLoad'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { useSpotlightEditorStore } from '../../../store/editor.spotlight'
import { QuickLinkType } from '../../mex/NodeSelect/NodeSelect'

export const INIT_PREVIEW: PreviewType = {
  text: DEFAULT_PREVIEW_TEXT,
  metadata: null,
  isSelection: false
}

const Content = () => {
  // * Store
  const normalMode = useSpotlightAppStore((store) => store.normalMode)
  const { setNodeContent, setPreviewEditorNode, setPreview } = useSpotlightEditorStore((store) => ({
    editorNode: store.node,
    preview: store.preview,
    loadNode: store.loadNode,
    setPreview: store.setPreview,
    saveEditorNode: store.setNode,
    setPreviewEditorNode: store.setNode,
    setNodeContent: store.setNodeContent
  }))

  // * Custom hooks
  const { getNode } = useLoad()
  const { resetEditor } = useEditorActions()
  const { search, selection, activeItem, activeIndex, searchResults } = useSpotlightContext()

  // * For setting the preview
  useEffect(() => {
    const resultNode = searchResults[activeIndex]
    const isNode = resultNode?.type === QuickLinkType.ilink

    if (isNode && !activeItem.active) {
      const isNew = resultNode?.extras?.new
      const val = search.type === CategoryType.quicklink ? search.value.slice(2) : search.value

      const nodeValue = val || getNewDraftKey()
      const node = isNew ? createNodeWithUid(nodeValue) : getNode(resultNode?.id ?? '')
      setPreviewEditorNode(node)
    }

    if (selection) {
      setPreview({
        ...selection,
        isSelection: true
      })
    } else {
      const content = useContentStore.getState().getContent(resultNode?.id)?.content ?? defaultContent.content
      setNodeContent(content)
      setPreview(INIT_PREVIEW)
    }
  }, [search.value, activeIndex, activeItem, selection, normalMode, searchResults])

  return (
    <StyledContent>
      <SideBar />
      <ErrorBoundary onReset={() => resetEditor(AppType.SPOTLIGHT)} FallbackComponent={EditorErrorFallback}>
        <Preview />
      </ErrorBoundary>
    </StyledContent>
  )
}

export default Content
