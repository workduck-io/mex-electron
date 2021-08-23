import {
  createPlateOptions,
  ELEMENT_MEDIA_EMBED,
  Plate,
  selectEditor,
  useStoreEditorRef,
  useStoreEditorValue,
} from '@udecode/plate'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ReactTooltip from 'react-tooltip'
import { EditorStyles } from '../Styled/Editor'
import tinykeys from 'tinykeys'
import { useSaveData } from '../Data/useSaveData'
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
import { useContentStore } from './Store/ContentStore'
import useDataStore from './Store/DataStore'
import { useEditorStore } from './Store/EditorStore'
import { useSyncStore } from './Store/SyncStore'

const options = createPlateOptions()

const Editor = () => {
  const fsContent = useEditorStore((state) => state.content)
  const nodeId = useEditorStore((state) => state.node.id)

  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const slash_commands = useDataStore((state) => state.slash_commands)
  const addSyncBlock = useSyncStore((state) => state.addSyncBlock)
  const syncId = useSyncStore((state) => state.syncId)

  const setFsContent = useContentStore((state) => state.setContent)

  useEffect(() => {
    ReactTooltip.rebuild()
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined)

  const editorState = useStoreEditorValue()
  const [id, setId] = useState('__null__')
  const editableProps = {
    placeholder: 'Murmuring the mex hype...',
    style: {
      padding: '15px',
    },
  }

  const saveData = useSaveData()

  const addTag = useDataStore((state) => state.addTag)
  const addILink = useDataStore((state) => state.addILink)

  const generateEditorId = () => `${id}`

  useEffect(() => {
    if (fsContent) {
      setContent(fsContent)
      setId(nodeId)
      // deserialize(fsContent)
      //   .then(sdoc => {
      //     return null;
      //   })
      //   .catch(e => console.error(e)); // eslint-disable-line no-console
    }
  }, [fsContent, nodeId, syncId])

  const onSave = () => {
    // On save the editor should serialize the state to markdown plaintext
    // setContent then save
    if (editorState) setFsContent(id, editorState)
    saveData(useContentStore.getState().contents)

    toast('Saved!', { duration: 1000 })
  }

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+KeyS': (event) => {
        event.preventDefault()
        onSave()
      },
    })
    return () => {
      unsubscribe()
    }
  })

  const editorRef = useStoreEditorRef()

  useEffect(() => {
    // console.log('Focusing', { editor: editorS });
    if (editorRef) selectEditor(editorRef, { edge: 'end', focus: true })
  }, [editorRef])

  // Combobox
  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(generateEditorId(), {
        ilink: {
          cbKey: ComboboxKey.ILINK,
          trigger: '[[',
          data: ilinks,
        },

        tag: {
          cbKey: ComboboxKey.TAG,
          trigger: '#',
          data: tags,
        },

        slash_command: {
          cbKey: ComboboxKey.SLASH_COMMAND,
          trigger: '/',
          data: slash_commands,
        },
      }),

      onKeyDown: useMultiComboboxOnKeyDown(
        {
          ilink: {
            slateElementType: ELEMENT_ILINK,
            newItemHandler: (newItem) => {
              addILink(newItem)
            },
          },
          tag: {
            slateElementType: ELEMENT_TAG,
            newItemHandler: (newItem) => {
              addTag(newItem)
            },
          },
          // Slash command configs

          slash_command: {
            slateElementType: ELEMENT_MEDIA_EMBED,
            // Support for creating slash commands by user can be added here
            newItemHandler: () => undefined,
          },
        },
        {
          webem: {
            slateElementType: ELEMENT_MEDIA_EMBED,
            command: 'webem',
            options: {
              url: 'http://example.com/',
            },
          },
          sync_block: {
            slateElementType: ELEMENT_SYNC_BLOCK,
            command: 'sync',
            getBlockData: () => {
              const nd = getNewBlockData()
              addSyncBlock(nd) // Also need to add the newly created block to the sync store
              return nd
            },
          },
        }
      ),
    },
  }

  const comboboxRenderConfig: ComboElementProps = {
    keys: {
      ilink: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (newItem) => {
            addILink(newItem)
          },
        },
        renderElement: ILinkComboboxItem,
      },
      tag: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_TAG,
          newItemHandler: (newItem) => {
            addTag(newItem)
          },
        },
        renderElement: TagComboboxItem,
      },
      slash_command: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_MEDIA_EMBED,
          newItemHandler: () => undefined,
        },
        renderElement: SlashComboboxItem,
      },
    },
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

export default Editor
