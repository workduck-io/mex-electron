import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { StyledBackground } from '../Spotlight/styled'
import { Scroll } from '../../styles/layout'
import { useEditorStore } from '../../../Editor/Store/EditorStore'
import { useContentStore } from '../../../Editor/Store/ContentStore'
import Editor, { useEditorPluginConfig } from '../../../Editor/Editor'
import { deserializeHTMLToDocumentFragment } from '@udecode/plate-html-serializer'
import generatePlugins from '../../../Editor/Plugins/plugins'
import { useStoreEditorRef } from '@udecode/plate-core'
import { useSpotlightEditorStore } from '../../../Spotlight/store/editor'
import { useSpotlightContext } from '../../../Spotlight/utils/context'

export const StyledPreview = styled.div`
  ${StyledBackground}
  ${Scroll}

  padding: 1rem;
  flex: 5;
  border-radius: 1rem;
  white-space: pre-wrap;
`

const Preview: React.FC<{ preview: any; nodeId: string }> = ({ preview, nodeId }) => {
  const editor = useStoreEditorRef(nodeId)
  const { search } = useSpotlightContext()
  const setFsContent = useContentStore((state) => state.setContent)
  const fsContent = useEditorStore((state) => state.content)

  const loadNodeFromId = useEditorStore(({ loadNodeFromId }) => loadNodeFromId)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  const config = useEditorPluginConfig(nodeId)
  const plugins = generatePlugins()
  const nodes = deserializeHTMLToDocumentFragment(editor, {
    plugins,
    element: preview?.text || '',
  })

  useEffect(() => {
    setFsContent(nodeId, [{ children: nodes }])
    if (!search) loadNodeFromId(nodeId)
    if (preview.isSelection) {
      setNodeContent([{ children: nodes }])
    }
  }, [preview.text])

  useEffect(() => {
    setContent(fsContent)
  }, [fsContent])

  return (
    <StyledPreview>
      <Editor focusAtBeginning={false} readOnly content={content} editorId={nodeId} />
    </StyledPreview>
  )
}

export default Preview
