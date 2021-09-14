import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { StyledBackground } from '../Spotlight/styled'
import { Scroll } from '../../styles/layout'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import Editor from '../../../Editor/Editor'
import { deserializeHTMLToDocumentFragment } from '@udecode/plate-html-serializer'
import generatePlugins from '../../../Editor/Plugins/plugins'
import { useStoreEditorRef } from '@udecode/plate-core'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { useSpotlightContext } from '../../../Spotlight/utils/context'
import { NodeEditorContent } from '../../../Editor/Store/Types'
import { combineSources } from '../../../Spotlight/utils/hooks'
import { useSpotlightSettingsStore } from '../../../Spotlight/store/settings'

export const StyledPreview = styled.div`
  ${StyledBackground}
  ${Scroll}
  position: relative;
  padding: 1rem;
  flex: 5;
  border-radius: 1rem;
  white-space: pre-wrap;
`

export const StyledEditorPreview = styled.div`
  /* ${Scroll} */
`

export const SeePreview = styled.div`
  position: fixed;
  left: 20%;
  cursor: pointer;
  z-index: 3000;
  padding: 4px 10px;
  border-radius: 14px;
  border: none;
  color: ${({ theme }) => theme.colors.text.fade};
  box-shadow: 0px 2px 4px ${({ theme }) => theme.colors.text.fade};
  background-color: ${({ theme }) => theme.colors.background.sidebar};
  bottom: 3.25rem;
`

export const useDeserializeSelectionToNodes = (
  nodeId: string,
  selection: { text: string; metadata: string }
): NodeEditorContent => {
  const editor = useStoreEditorRef(nodeId)

  const plugins = generatePlugins()
  const nodes = deserializeHTMLToDocumentFragment(editor, {
    plugins,
    element: selection?.text || ''
  })

  return nodes
}

const Preview: React.FC<{ preview: any; nodeId: string }> = ({ preview, nodeId }) => {
  const { search, selection } = useSpotlightContext()

  const setFsContent = useContentStore((state) => state.setContent)
  const previewContent = useEditorStore((state) => state.content)
  const fsContent = useEditorStore((state) => state.content)
  const ref = useRef<HTMLDivElement>()
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)

  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  const nodes = useDeserializeSelectionToNodes(nodeId, preview)
  const showSource = useSpotlightSettingsStore((state) => state.showSource)

  useEffect(() => {
    if (preview.isSelection) {
      const newNodeContent = [{ children: nodes }]

      const changedContent = showSource ? combineSources(fsContent, newNodeContent) : fsContent

      setNodeContent([...changedContent, { children: nodes }])
      setFsContent(nodeId, [...changedContent, { children: nodes }])
    }
  }, [preview.text, showSource])

  useEffect(() => {
    if (!search) loadNodeFromId(nodeId)
  }, [preview.text])

  return (
    <StyledPreview ref={ref}>
      {selection && <SeePreview onClick={handleScrollToBottom}>See Preview</SeePreview>}
      <StyledEditorPreview>
        <Editor focusAtBeginning={false} readOnly content={previewContent} editorId={nodeId} />
      </StyledEditorPreview>
    </StyledPreview>
  )
}

export default Preview
