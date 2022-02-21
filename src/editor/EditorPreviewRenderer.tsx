import { Plate } from '@udecode/plate'
import React from 'react'
import { EditorStyles } from '../style/Editor'
import generatePlugins from './Plugins/plugins'
import { editorPreviewComponents } from './Components/components'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
}

const EditorPreviewRenderer = ({ content, editorId }: EditorPreviewRendererProps) => {
  const editableProps = {
    placeholder: 'Murmuring the mex hype... ',
    spellCheck: false,
    style: {
      padding: '15px'
    },
    readOnly: true
  }

  // We get memoized plugins
  const plugins = generatePlugins(editorPreviewComponents, { exclude: { dnd: true } })

  return (
    <EditorStyles>
      <Plate id={editorId} editableProps={editableProps} value={content} plugins={plugins}></Plate>
    </EditorStyles>
  )
}
export default EditorPreviewRenderer
