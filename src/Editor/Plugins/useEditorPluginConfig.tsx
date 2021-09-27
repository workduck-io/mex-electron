import { ELEMENT_MEDIA_EMBED } from '@udecode/plate'
import { useSyncConfig } from '../Components/SlashCommands/useSyncConfig'
import { useSnippets } from '../../Snippets/useSnippets'
import { ComboboxKey } from '../Components/combobox/useComboboxStore'
import { ELEMENT_ILINK } from '../Components/ilink/defaults'
import useMultiComboboxOnChange from '../Components/multi-combobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../Components/multi-combobox/useMultiComboboxOnKeyDown'
import { ELEMENT_SYNC_BLOCK } from '../Components/SyncBlock'
import { getNewBlockData } from '../Components/SyncBlock/getNewBlockData'
import { ELEMENT_TAG } from '../Components/tag/defaults'
import useDataStore from '../Store/DataStore'
import { useSyncStore } from '../Store/SyncStore'

const useEditorPluginConfig = (editorId: string) => {
  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const slash_commands = useDataStore((state) => state.slashCommands)
  const addSyncBlock = useSyncStore((state) => state.addSyncBlock)

  const addTag = useDataStore((state) => state.addTag)
  const addILink = useDataStore((state) => state.addILink)
  const { getSnippetsConfigs } = useSnippets()
  const { getSyncBlockConfigs } = useSyncConfig()

  // Combobox
  const snippetConfigs = getSnippetsConfigs()
  const syncBlockConfigs = getSyncBlockConfigs()

  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, {
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
          // For `/sync`
          // sync_block: {
          //   slateElementType: ELEMENT_SYNC_BLOCK,
          //   command: 'sync',
          //   getBlockData: () => {
          //     const nd = getNewBlockData()
          //     addSyncBlock(nd) // Also need to add the newly created block to the sync store
          //     return nd
          //   },
          // },
          ...snippetConfigs,
          ...syncBlockConfigs
        }
      )
    }
  }

  return pluginConfigs
}

export default useEditorPluginConfig
