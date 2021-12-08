import { createPlateOptions, Plate, selectEditor, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactTooltip from 'react-tooltip'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { EditorStyles } from '../Styled/Editor'
import { withStyledDraggables } from './Actions/withDraggable'
import { withStyledPlaceHolders } from './Actions/withPlaceholder'
import components from './Components/components'
import BallonMarkToolbarButtons from './Components/EditorToolbar'
import { MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import generatePlugins from './Plugins/plugins'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'

const options = createPlateOptions()

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  readOnly?: boolean
  focusAtBeginning?: boolean
  showBalloonToolbar?: boolean
}

// High performance guaranteed
const Editor = ({ content, editorId, readOnly, focusAtBeginning, showBalloonToolbar }: EditorProps) => {
  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const editableProps = {
    // placeholder: 'Murmuring the mex hype... This should be part of an update',
    spellCheck: false,
    autoFocus: true,
    style: {
      padding: '15px'
    },
    readOnly
  }

  const setNodePreview = useGraphStore((store) => store.setNodePreview)

  const generateEditorId = () => `${editorId}`
  const editorRef = usePlateEditorRef()

  useEffect(() => {
    if (editorRef && focusAtBeginning) {
      selectEditor(editorRef, { edge: 'end', focus: true })
    }
  }, [editorRef, editorId]) // eslint-disable-line react-hooks/exhaustive-deps

  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId)

  // We get memoized plugins
  const prePlugins = generatePlugins()
  const plugins = [
    ...prePlugins,
    {
      onChange: pluginConfigs.combobox.onChange,
      onKeyDown: pluginConfigs.combobox.onKeyDown
    }
  ]

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <ReactTooltip effect="solid" type="info" />
        {content && (
          <EditorStyles onClick={() => setNodePreview(false)}>
            {showBalloonToolbar && <BallonMarkToolbarButtons />}
            <Plate
              id={generateEditorId()}
              editableProps={editableProps}
              value={content}
              plugins={plugins}
              components={withStyledPlaceHolders(withStyledDraggables(components))}
              options={options}
            >
              <MultiComboboxContainer keys={comboConfigData.keys} slashCommands={comboConfigData.slashCommands} />
            </Plate>
          </EditorStyles>
        )}
      </DndProvider>
    </>
  )
}

Editor.defaultProps = {
  readOnly: false,
  focusAtBeginning: true,
  showBalloonToolbar: false
}

export default Editor
