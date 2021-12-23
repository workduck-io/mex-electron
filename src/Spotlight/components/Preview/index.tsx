import React, { useEffect, useRef } from 'react'
import { NodeProperties, useEditorStore } from '../../../Editor/Store/EditorStore'
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
import useLoad from '../../../Hooks/useLoad/useLoad'

export type PreviewType = {
  text: string
  metadata: string | null
  isSelection: boolean
}

export type PreviewProps = {
  preview: PreviewType
  node: NodeProperties
}

const Preview: React.FC<PreviewProps> = ({ preview, node }) => {
  const { search, selection } = useSpotlightContext()

  const ref = useRef<HTMLDivElement>()

  const fsContent = useEditorStore((state) => state.content)
  const previewContent = useEditorStore((state) => state.content)
  const setFsContent = useContentStore((state) => state.setContent)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)
  const { loadNodeProps } = useLoad()

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  const nodes = useDeserializeSelectionToNodes(node.uid, preview)

  useEffect(() => {
    const newNodeContent = [{ children: nodes }]
    if (preview.isSelection && nodes) {
      const changedContent = showSource ? combineSources(fsContent, newNodeContent) : fsContent

      setNodeContent([...changedContent, { children: nodes }])
      setFsContent(node.uid, [...changedContent, { children: nodes }])
    }
  }, [preview.text, showSource])

  useEffect(() => {
    if (!search) {
      loadNodeProps(node)
    }
  }, [preview.text])

  return (
    <StyledPreview ref={ref} data-tour="mex-quick-capture-preview">
      {selection && (
        <SeePreview onClick={handleScrollToBottom}>
          <Icon icon={downIcon} />
        </SeePreview>
      )}
      <StyledEditorPreview>
        <Editor focusAtBeginning={false} content={previewContent} editorId={node.uid} />
      </StyledEditorPreview>
    </StyledPreview>
  )
}

export default Preview
