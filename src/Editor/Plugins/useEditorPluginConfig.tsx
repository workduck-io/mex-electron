import { ELEMENT_MEDIA_EMBED } from '@udecode/plate'
import { useEffect, useMemo } from 'react'
import useAnalytics from '../../analytics'
import { useSnippets } from '../../Snippets/useSnippets'
import { ComboboxKey, useComboboxStore } from '../Components/combobox/useComboboxStore'
import { ILinkComboboxItem } from '../Components/ilink/components/ILinkComboboxItem'
import { ELEMENT_ILINK } from '../Components/ilink/defaults'
import { ELEMENT_INLINE_BLOCK } from '../Components/InlineBlock/types'
import { ComboConfigData } from '../Components/multi-combobox/multiComboboxContainer'
import useMultiComboboxOnChange from '../Components/multi-combobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../Components/multi-combobox/useMultiComboboxOnKeyDown'
import { SlashComboboxItem } from '../Components/SlashCommands/SlashComboboxItem'
import { useSyncConfig } from '../Components/SlashCommands/useSyncConfig'
import { TagComboboxItem } from '../Components/tag/components/TagComboboxItem'
import { ELEMENT_TAG } from '../Components/tag/defaults'
import useDataStore from '../Store/DataStore'
import { useEditorStore } from '../Store/EditorStore'

const useEditorPluginConfig = (editorId: string) => {
  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const slashCommands = useDataStore((state) => state.slashCommands)
  const node = useEditorStore((state) => state.node)

  const addTag = useDataStore((state) => state.addTag)
  const addILink = useDataStore((state) => state.addILink)
  const setKeys = useComboboxStore((state) => state.setKeys)
  const setComboConfig = useComboboxStore((state) => state.setComboConfig)
  const { getSnippetsConfigs } = useSnippets()
  const { getSyncBlockConfigs } = useSyncConfig()
  // const { trackEvent } = useAnalytics()

  // Combobox
  const snippetConfigs = getSnippetsConfigs()
  const syncBlockConfigs = getSyncBlockConfigs()

  const ilinksForCurrentNode = useMemo(() => {
    return ilinks.filter((item) => item.key !== node.id)
  }, [node, ilinks])

  // const comboConfigData: ComboConfigData = useMemo(
  //   () => (),
  //   [snippetConfigs, syncBlockConfigs]
  // )

  useEffect(
    () =>
      setComboConfig({
        keys: {
          ilink: {
            slateElementType: ELEMENT_ILINK,
            newItemHandler: (newItem, parentId?) => {
              addILink(newItem, null, parentId)
            },
            renderElement: ILinkComboboxItem
          },
          inline_block: {
            slateElementType: ELEMENT_INLINE_BLOCK,
            newItemHandler: (newItem, parentId?) => {
              addILink(newItem, null, parentId)
            },
            renderElement: ILinkComboboxItem
          },
          tag: {
            slateElementType: ELEMENT_TAG,
            newItemHandler: (newItem) => {
              addTag(newItem)
            },
            renderElement: TagComboboxItem
          },
          slash_command: {
            slateElementType: 'slash_command_comboTypeHandler',
            newItemHandler: () => undefined,
            renderElement: SlashComboboxItem
          }
        },
        slashCommands: {
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
      }),
    []
  )

  useEffect(() => {
    console.log({})
    setKeys({
      ilink: {
        cbKey: ComboboxKey.ILINK,
        trigger: '[[',
        data: ilinks,
        icon: 'ri:file-list-2-line'
      },
      inline_block: {
        cbKey: ComboboxKey.INLINE_BLOCK,
        trigger: '![[',
        data: ilinksForCurrentNode,
        icon: 'ri:picture-in-picture-line'
      },
      tag: {
        cbKey: ComboboxKey.TAG,
        trigger: '#',
        data: tags,
        icon: 'ri:hashtag'
      },
      slash_command: {
        cbKey: ComboboxKey.SLASH_COMMAND,
        trigger: '/',
        icon: 'ri:flask-line',
        data: slashCommands
      }
    })
  }, [ilinks, ilinksForCurrentNode, tags, slashCommands])

  // const pluginConfigs = {
  // }

  return {
    onChange: useMultiComboboxOnChange(editorId),
    onKeyDown: useMultiComboboxOnKeyDown()
  }
}

export default useEditorPluginConfig
