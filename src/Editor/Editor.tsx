import { createPlateOptions, Plate, selectEditor, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect, useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { EditorStyles } from '../Styled/Editor'
import useDataStore from '../Editor/Store/DataStore'
import { withStyledDraggables } from './Actions/withDraggable'
import { withStyledPlaceHolders } from './Actions/withPlaceholder'
import components from './Components/components'
import BallonMarkToolbarButtons from './Components/EditorToolbar'
import { MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import generatePlugins from './Plugins/plugins'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'
import { useSnippetStore } from './Store/SnippetStore'
import { useIntegrationStore } from './Store/IntegrationStore'
import { useSyncStore } from './Store/SyncStore'

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
  const editableProps = useMemo(
    () => ({
      // placeholder: 'Murmuring the mex hype... This should be part of an update',
      spellCheck: false,
      autoFocus: true,
      style: {
        padding: '15px'
      },
      readOnly
    }),
    []
  )

  const setNodePreview = useGraphStore((store) => store.setNodePreview)

  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const slashCommands = useDataStore((state) => state.slashCommands)
  const snippets = useSnippetStore((state) => state.snippets)
  const templates = useSyncStore((state) => state.templates)

  const generateEditorId = () => `${editorId}`
  const editorRef = usePlateEditorRef()

  useEffect(() => {
    if (editorRef && focusAtBeginning) {
      selectEditor(editorRef, { edge: 'end', focus: true })
    }
  }, [editorRef, editorId]) // eslint-disable-line react-hooks/exhaustive-deps

  const prePlugins = generatePlugins() // this is memoized

  const { onChange, onKeyDown } = useEditorPluginConfig(editorId)
  const plugins =
    // Usememo removes rerendering but combobox does not work
    // The box is shown empty with a create new option.
    useMemo(
      () => [
        ...prePlugins,
        {
          onChange,
          onKeyDown
        }
      ],
      [tags, ilinks, slashCommands, snippets, templates]
    )

  return (
    <>
      <DndProvider backend={HTML5Backend}>
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
              <MultiComboboxContainer />
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
