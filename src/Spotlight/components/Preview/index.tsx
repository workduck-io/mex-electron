import React, { useEffect, useRef } from 'react'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import Editor from '../../../Editor/Editor'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import { combineSources } from '../../../Spotlight/utils/hooks'
import downIcon from '@iconify-icons/ph/arrow-down-bold'
import { Icon } from '@iconify/react'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'
import { SeePreview, StyledEditorPreview, StyledPreview } from './styled'
import { useDeserializeSelectionToNodes } from '../../../Spotlight/utils/helpers'

export type PreviewType = {
  text: string
  metadata: string | null
  isSelection: boolean
}

export type PreviewProps = {
  preview: PreviewType
  nodeId: string
}

const Preview: React.FC<PreviewProps> = ({ preview, nodeId }) => {
  const { search, selection } = useSpotlightContext()

  const ref = useRef<HTMLDivElement>()

  const fsContent = useEditorStore((state) => state.content)
  const previewContent = useEditorStore((state) => state.content)
  const setFsContent = useContentStore((state) => state.setContent)
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  const nodes = useDeserializeSelectionToNodes(nodeId, preview)

  useEffect(() => {
    const newNodeContent = [{ children: nodes }]
    if (preview.isSelection && nodes) {
      const changedContent = showSource ? combineSources(fsContent, newNodeContent) : fsContent

      setNodeContent([...changedContent, { children: nodes }])
      setFsContent(nodeId, [...changedContent, { children: nodes }])
    }
  }, [preview.text, showSource])

  useEffect(() => {
    if (!search) {
      loadNodeFromId(nodeId)
    }
  }, [preview.text])

  return (
    <StyledPreview ref={ref}>
      {selection && (
        <SeePreview onClick={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
      <StyledEditorPreview>
        <Editor focusAtBeginning={false} readOnly content={previewContent} editorId={nodeId} />
      </StyledEditorPreview>
    </StyledPreview>
  )
}

export default Preview
