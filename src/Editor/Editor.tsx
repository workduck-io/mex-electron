import { createPlateOptions, ELEMENT_MEDIA_EMBED, Plate, selectEditor, usePlateEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import { useGraphStore } from '../Components/Graph/GraphStore'
import { EditorStyles } from '../Styled/Editor'
import components from './Components/components'
import BallonMarkToolbarButtons from './Components/EditorToolbar'
import { ILinkComboboxItem } from './Components/ilink/components/ILinkComboboxItem'
import { ELEMENT_ILINK } from './Components/ilink/defaults'
import { ELEMENT_INLINE_BLOCK } from './Components/InlineBlock/types'
import { ComboElementProps, MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import { SlashComboboxItem } from './Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from './Components/tag/components/TagComboboxItem'
import { ELEMENT_TAG } from './Components/tag/defaults'
import generatePlugins from './Plugins/plugins'
import useEditorPluginConfig from './Plugins/useEditorPluginConfig'
import useDataStore from './Store/DataStore'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { withStyledDraggables } from './Actions/withDraggable'
import { withStyledPlaceHolders } from './Actions/withPlaceholder'

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

  const addTag = useDataStore((state) => state.addTag)
  const addILink = useDataStore((state) => state.addILink)
  const setNodePreview = useGraphStore((store) => store.setNodePreview)

  const generateEditorId = () => `${editorId}`
  const editorRef = usePlateEditorRef()

  useEffect(() => {
    if (editorRef && focusAtBeginning) {
      selectEditor(editorRef, { edge: 'end', focus: true })
    }
  }, [editorRef, editorId]) // eslint-disable-line react-hooks/exhaustive-deps

  const comboboxRenderConfig: ComboElementProps = {
    keys: {
      ilink: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (newItem, parentId?) => {
            addILink(newItem, null, parentId)
          }
        },
        renderElement: ILinkComboboxItem
      },
      inline_block: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_INLINE_BLOCK,
          newItemHandler: (newItem, parentId?) => {
            addILink(newItem, null, parentId)
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
              <MultiComboboxContainer keys={comboboxRenderConfig.keys} />
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
