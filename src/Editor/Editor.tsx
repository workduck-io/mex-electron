import { Plate, selectEditor, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { EditorStyles } from '../Styled/Editor'
import BallonMarkToolbarButtons from './Components/EditorToolbar'
import { MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import generatePlugins from './Plugins/plugins'
import { debounce } from 'lodash'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'
import { useEditorChange } from '../Spotlight/components/Content'

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
  focusAtBeginning?: boolean
  showBalloonToolbar?: boolean
}

// High performance guaranteed
const Editor = ({
  content,
  editorId,
  autoFocus = true,
  readOnly,
  onChange,
  focusAtBeginning,
  showBalloonToolbar
}: EditorProps) => {
  const editableProps = {
    spellCheck: false,
    autoFocus: autoFocus,
    style: {
      padding: '15px'
    },
    readOnly
  }

  const setNodePreview = useGraphStore((store) => store.setNodePreview)

  // const generateEditorId = () => `${editorId}`
  const editorRef = usePlateEditorRef()

  useEffect(() => {
    if (editorRef && focusAtBeginning) {
      selectEditor(editorRef, { edge: 'end', focus: true })
    }
  }, [editorRef, editorId, focusAtBeginning]) // eslint-disable-line react-hooks/exhaustive-deps

  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId)

  // We get memoized plugins
  const prePlugins = generatePlugins()
  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  useEditorChange(editorId, content)

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {content && (
          <EditorStyles onClick={() => setNodePreview(false)} data-tour="mex-onboarding-draft-editor">
            {showBalloonToolbar && <BallonMarkToolbarButtons />}
            <Plate
              id={editorId}
              editableProps={editableProps}
              value={content}
              plugins={plugins}
              onChange={debounce(!readOnly && typeof onChange === 'function' ? onChange : () => undefined, 1000)}
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
