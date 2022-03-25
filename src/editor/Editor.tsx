import { Plate, selectEditor, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import generatePlugins, { PluginOptionType } from './Plugins/plugins'

import BallonMarkToolbarButtons from './Components/EditorBalloonToolbar'
import { DndProvider } from 'react-dnd'
import { EditorStyles } from '../style/Editor'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MENU_ID } from './Components/EditorContextMenu'
import { MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import components from './Components/components'
import { debounce } from 'lodash'
import { useContextMenu } from 'react-contexify'
import { useEditorChange } from '../hooks/useEditorActions'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'
import { useGraphStore } from '../store/useGraphStore'

interface EditorProps {
  content: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  editorId: string
  readOnly?: boolean
  onChange?: any
  autoFocus?: boolean
  focusAtBeginning?: boolean
  showBalloonToolbar?: boolean
  options?: PluginOptionType
}

// High performance guaranteed
export const Editor = ({
  content,
  editorId,
  autoFocus = true,
  options,
  readOnly = false,
  onChange,
  focusAtBeginning = true,
  showBalloonToolbar = false
}: EditorProps) => {
  const editableProps = {
    spellCheck: false,
    autoFocus: autoFocus,
    style: {
      padding: '32px'
    },
    readOnly
  }

  const setNodePreview = useGraphStore((store) => store.setNodePreview)

  // const generateEditorId = () => `${editorId}`
  const editorRef = usePlateEditorRef()
  const { show } = useContextMenu({ id: MENU_ID })

  useEffect(() => {
    if (editorRef && focusAtBeginning) {
      selectEditor(editorRef, { edge: 'end', focus: true })
    }
  }, [editorRef, editorId, focusAtBeginning]) // eslint-disable-line react-hooks/exhaustive-deps

  const { pluginConfigs, comboConfigData } = useEditorPluginConfig(editorId)

  // function to add two numbers

  const prePlugins = generatePlugins(components, options)
  const plugins = [
    ...prePlugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onContextMenu: () => (ev) => {
          show(ev)
        },
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  useEditorChange(editorId, content)

  return (
    <>
      <EditorStyles onClick={() => setNodePreview(false)} data-tour="mex-onboarding-draft-editor">
        <Plate
          id={editorId}
          editableProps={editableProps}
          value={content}
          plugins={plugins}
          onChange={debounce(!readOnly && typeof onChange === 'function' ? onChange : () => undefined, 1000)}
        >
          {showBalloonToolbar && <BallonMarkToolbarButtons />}
          <MultiComboboxContainer config={comboConfigData} />
        </Plate>
      </EditorStyles>
    </>
  )
}

const withDndProvider = (Component: any) => {
  const DndDefaultEditor = (props: EditorProps) => (
    <DndProvider backend={HTML5Backend}>
      <Component {...props} />
    </DndProvider>
  )
  return DndDefaultEditor
}

withDndProvider.displayName = 'DefaultEditor'

export default withDndProvider(Editor)
