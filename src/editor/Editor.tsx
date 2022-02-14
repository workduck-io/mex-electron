import { AnyObject, Plate, selectEditor, TNode, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useGraphStore } from '../store/useGraphStore'
import { EditorStyles } from '../style/Editor'
import BallonMarkToolbarButtons from './Components/EditorToolbar'
import { MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import generatePlugins from './Plugins/plugins'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'
import { useEditorChange } from '../hooks/useEditorActions'
import components from './Components/components'
import { useNewSearchStore } from '../store/useSearchStore'
import useSuggestionStore from '../store/useSuggestions'
import { convertContentToRawText } from '../utils/search/localSearch'
import { useDebouncedCallback } from 'use-debounce'
import useToggleElements from '../hooks/useToggleElements'
import { mog } from '../utils/lib/helper'

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

  const { showSuggestedNodes } = useToggleElements()
  const { setSuggestions } = useSuggestionStore()
  const searchIndex = useNewSearchStore((store) => store.searchIndex)
  const setNodePreview = useGraphStore((store) => store.setNodePreview)

  // const generateEditorId = () => `${editorId}`
  const editorRef = usePlateEditorRef()

  const debuncedOnChange = useDebouncedCallback((value) => {
    if (showSuggestedNodes) {
      const rawText = convertContentToRawText(value.slice(-2))
      const results = searchIndex(rawText)
      const withoutCurrentNode = results.filter((item) => item.nodeUID !== editorId)

      mog('Nodes', { withoutCurrentNode })

      setSuggestions(withoutCurrentNode)
    }
    onChange()
  }, 1000)

  useEffect(() => {
    if (editorRef && focusAtBeginning) {
      selectEditor(editorRef, { edge: 'end', focus: true })
    }
  }, [editorRef, editorId, focusAtBeginning]) // eslint-disable-line react-hooks/exhaustive-deps

  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId)

  // We get memoized plugins
  const prePlugins = generatePlugins(components)
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

  const handleOnChange = (value: TNode<AnyObject>[]) => {
    debuncedOnChange(value)
  }

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        {content && (
          <EditorStyles onClick={() => setNodePreview(false)} data-tour="mex-onboarding-draft-editor">
            <Plate
              id={editorId}
              editableProps={editableProps}
              value={content}
              plugins={plugins}
              onChange={handleOnChange}
            >
              {showBalloonToolbar && <BallonMarkToolbarButtons />}
              <MultiComboboxContainer config={comboConfigData} />
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
