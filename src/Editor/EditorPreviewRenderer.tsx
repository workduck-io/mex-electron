import { createPlateOptions, Plate } from '@udecode/plate'
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { EditorStyles } from '../Styled/Editor'
import { editorPreviewComponents } from './Components/components'
import generatePlugins from './Plugins/plugins'

interface EditorPreviewRendererProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
}

const options = createPlateOptions()

const EditorPreviewRenderer = ({ content, editorId }: EditorPreviewRendererProps) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const editableProps = {
    placeholder: 'Murmuring the mex hype... This should be part of an updated',
    spellCheck: false,
    style: {
      padding: '15px'
    },
    readOnly: true
  }

  const generateEditorId = () => `${editorId}`

  // We get memoized plugins
  const plugins = generatePlugins()

  return (
    <>
      {content && (
        <EditorStyles>
          <Plate
            id={generateEditorId()}
            editableProps={editableProps}
            value={content}
            plugins={plugins}
            components={editorPreviewComponents}
            options={options}
          ></Plate>
        </EditorStyles>
      )}
    </>
  )
}
export default EditorPreviewRenderer
