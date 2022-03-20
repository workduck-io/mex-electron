import { getPlateEditorRef, Plate, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import { EditorStyles } from '../style/Editor'
import generatePlugins from './Plugins/plugins'
import { editorPreviewComponents } from './Components/components'
import styled from 'styled-components'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  noStyle?: boolean
}

const PreviewStyles = styled(EditorStyles)`
  font-size: 14px;
`

const EditorPreviewRenderer = ({ content, editorId, noStyle }: EditorPreviewRendererProps) => {
  const editableProps = {
    placeholder: 'Murmuring the mex hype... ',
    spellCheck: false,
    style: noStyle
      ? {}
      : {
          padding: '15px'
        },
    readOnly: true
  }

  // We get memoized plugins
  const plugins = generatePlugins(editorPreviewComponents, { exclude: { dnd: true } })

  return (
    <PreviewStyles>
      <Plate id={editorId} editableProps={editableProps} value={content} plugins={plugins} />
    </PreviewStyles>
  )
}
export default EditorPreviewRenderer
