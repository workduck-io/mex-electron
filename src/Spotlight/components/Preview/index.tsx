import React, { useEffect, useRef, useState } from 'react'
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

const Preview: React.FC<{ preview: any; nodeId: string }> = ({ preview, nodeId }) => {
  const editor = useStoreEditorRef(nodeId)
  const { search, selection } = useSpotlightContext()
  const setFsContent = useContentStore((state) => state.setContent)
  const fsContent = useEditorStore((state) => state.content)
  const ref = useRef<HTMLDivElement>()

  const loadNodeFromId = useEditorStore(({ loadNodeFromId }) => loadNodeFromId)
  const setNodeContent = useSpotlightEditorStore((state) => state.setNodeContent)

  const handleScrollToBottom = () => {
    ref.current.scrollTop = ref.current.scrollHeight
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  const config = useEditorPluginConfig(nodeId)
  const plugins = generatePlugins()
  const nodes = deserializeHTMLToDocumentFragment(editor, {
    plugins,
    element: preview?.text || '',
  })

  useEffect(() => {
    // setFsContent(nodeId, [{ children: nodes }])

    if (preview.isSelection) {
      console.log(JSON.stringify(fsContent, null, 2))
      setNodeContent([...fsContent, { children: nodes }])
      setFsContent(nodeId, [...fsContent, { children: nodes }])
    }
    if (!search) loadNodeFromId(nodeId)
  }, [preview.text])

  useEffect(() => {
    setContent(fsContent)
  }, [fsContent])

  return (
    <StyledPreview ref={ref}>
      {selection && <SeePreview onClick={handleScrollToBottom}>See Preview</SeePreview>}
      <StyledEditorPreview>
        <Editor focusAtBeginning={false} readOnly content={content} editorId={nodeId} />
      </StyledEditorPreview>
    </StyledPreview>
  )
}

export default Preview
