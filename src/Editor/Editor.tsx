import { createPlateOptions, ELEMENT_MEDIA_EMBED, Plate, selectEditor, useStoreEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { EditorStyles } from '../Styled/Editor'
import components from './Components/components'
import BallonToolbarMarks from './Components/EditorToolbar'
import { ILinkComboboxItem } from './Components/ilink/components/ILinkComboboxItem'
import { ELEMENT_ILINK } from './Components/ilink/defaults'
import { ComboElementProps, MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import { SlashComboboxItem } from './Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from './Components/tag/components/TagComboboxItem'
import { ELEMENT_TAG } from './Components/tag/defaults'
import generatePlugins from './Plugins/plugins'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'
import useDataStore from './Store/DataStore'

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
    placeholder: 'Murmuring the mex hype...',
    spellCheck: false,
    style: {
      padding: '15px'
    },
    readOnly
  }

  const addTag = useDataStore((state) => state.addTag)
  const addILink = useDataStore((state) => state.addILink)

  const generateEditorId = () => `${editorId}`
  const editorRef = useStoreEditorRef()

  useEffect(() => {
    if (editorRef && focusAtBeginning) selectEditor(editorRef, { edge: 'start', focus: true })
  }, [editorRef])

  const comboboxRenderConfig: ComboElementProps = {
    keys: {
      ilink: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (newItem) => {
            addILink(newItem)
          }
        },
        renderElement: ILinkComboboxItem
      },
      tag: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_TAG,
          newItemHandler: (newItem) => {
            addTag(newItem)
          }
        },
        renderElement: TagComboboxItem
      },
      slash_command: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_MEDIA_EMBED,
          newItemHandler: () => undefined
        },
        renderElement: SlashComboboxItem
      }
    }
  }
  const pluginConfigs = useEditorPluginConfig(editorId)

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
      {content && (
        <EditorStyles>
          {showBalloonToolbar && <BallonToolbarMarks />}
          <Plate
            id={generateEditorId()}
            editableProps={editableProps}
            value={content}
            plugins={plugins}
            components={components}
            options={options}
          >
            <MultiComboboxContainer keys={comboboxRenderConfig.keys} />
          </Plate>
        </EditorStyles>
      )}
    </>
  )
}

Editor.defaultProps = {
  readOnly: false,
  focusAtBeginning: true,
  showBalloonToolbar: false
}

export default Editor
