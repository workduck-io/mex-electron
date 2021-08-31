import { createPlateOptions, ELEMENT_MEDIA_EMBED, Plate, selectEditor, useStoreEditorRef } from '@udecode/plate'
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import tinykeys from 'tinykeys'
import { useSnippets } from '../Snippets/useSnippets'
import { EditorStyles } from '../Styled/Editor'
import { ComboboxKey } from './Components/combobox/useComboboxStore'
import components from './Components/components'
import { ILinkComboboxItem } from './Components/ilink/components/ILinkComboboxItem'
import { ELEMENT_ILINK } from './Components/ilink/defaults'
import { ComboElementProps, MultiComboboxContainer } from './Components/multi-combobox/multiComboboxContainer'
import useMultiComboboxOnChange from './Components/multi-combobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from './Components/multi-combobox/useMultiComboboxOnKeyDown'
import { SlashComboboxItem } from './Components/SlashCommands/SlashComboboxItem'
import { ELEMENT_SYNC_BLOCK } from './Components/SyncBlock'
import { getNewBlockData } from './Components/SyncBlock/getNewBlockData'
import { TagComboboxItem } from './Components/tag/components/TagComboboxItem'
import { ELEMENT_TAG } from './Components/tag/defaults'
import generatePlugins from './Plugins/plugins'
import useDataStore from './Store/DataStore'
import { useSyncStore } from './Store/SyncStore'

const options = createPlateOptions()

interface EditorProps {
  content: any[]
  editorId: string
  readOnly?: boolean
  focusAtBeginning?: boolean

  onSave?: () => void
}

const Editor = ({ content, editorId, onSave, readOnly, focusAtBeginning }: EditorProps) => {
  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const slash_commands = useDataStore((state) => state.slashCommands)
  const addSyncBlock = useSyncStore((state) => state.addSyncBlock)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  const editableProps = {
    placeholder: 'Murmuring the mex hype...',
    style: {
      padding: '15px'
    },
    readOnly
  }

  const addTag = useDataStore((state) => state.addTag)
  const addILink = useDataStore((state) => state.addILink)
  const { getSnippetsConfigs } = useSnippets()

  const generateEditorId = () => `${editorId}`
  const editorRef = useStoreEditorRef()

  useEffect(() => {
    // console.log('Focusing', { editor: editorS });
    if (editorRef && focusAtBeginning) selectEditor(editorRef, { edge: 'start', focus: true })
  }, [editorRef])

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyS': (event) => {
        event.preventDefault()
        onSave()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  // Combobox
  const snippetConfigs = getSnippetsConfigs()
  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(generateEditorId(), {
        ilink: {
          cbKey: ComboboxKey.ILINK,
          trigger: '[[',
          data: ilinks
        },

        tag: {
          cbKey: ComboboxKey.TAG,
          trigger: '#',
          data: tags
        },

        slash_command: {
          cbKey: ComboboxKey.SLASH_COMMAND,
          trigger: '/',
          data: slash_commands
        }
      }),

      onKeyDown: useMultiComboboxOnKeyDown(
        {
          ilink: {
            slateElementType: ELEMENT_ILINK,
            newItemHandler: (newItem) => {
              addILink(newItem)
            }
          },
          tag: {
            slateElementType: ELEMENT_TAG,
            newItemHandler: (newItem) => {
              addTag(newItem)
            }
          },
          // Slash command configs
          slash_command: {
            slateElementType: ELEMENT_MEDIA_EMBED,
            newItemHandler: () => undefined
          }
        },
        {
          webem: {
            slateElementType: ELEMENT_MEDIA_EMBED,
            command: 'webem',
            options: {
              url: 'http://example.com/'
            }
          },
          sync_block: {
            slateElementType: ELEMENT_SYNC_BLOCK,
            command: 'sync',
            getBlockData: () => {
              const nd = getNewBlockData()
              addSyncBlock(nd) // Also need to add the newly created block to the sync store
              return nd
            }
          },
          ...snippetConfigs
        }
      )
    }
  }

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

  // We get memoized plugins
  const plugins = generatePlugins(pluginConfigs)

  return (
    <>
      {content && (
        <EditorStyles>
          {/* <BallonToolbarMarks /> */}
          <Plate
            // onChange={onChange}
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
  onSave: () => undefined
}

export default Editor
