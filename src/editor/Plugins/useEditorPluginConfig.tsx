import useActions from '@components/spotlight/Actions/useActions'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { ELEMENT_ACTION_BLOCK } from '@editor/Components/Actions/types'
import { useShareModalStore } from '@components/mex/Mention/ShareModalStore'
import { useMentionStore } from '@store/useMentionStore'
import { ELEMENT_MEDIA_EMBED, ELEMENT_MENTION, ELEMENT_PARAGRAPH, ELEMENT_TABLE } from '@udecode/plate'
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw'
import { mog } from '@utils/lib/helper'
import { useMemo } from 'react'
import { QuickLinkType } from '../../components/mex/NodeSelect/NodeSelect'
import { useOpenReminderModal } from '../../components/mex/Reminders/CreateReminderModal'
import { useSnippets } from '../../hooks/useSnippets'
import { CategoryType } from '../../store/Context/context.spotlight'
import useDataStore from '../../store/useDataStore'
import { useEditorStore } from '../../store/useEditorStore'
import { useRouting } from '../../views/routes/urls'
import { ComboboxKey } from '../Components/combobox/useComboboxStore'
import { ILinkComboboxItem } from '../Components/ilink/components/ILinkComboboxItem'
import { ELEMENT_ILINK } from '../Components/ilink/defaults'
import { ELEMENT_INLINE_BLOCK } from '../Components/InlineBlock/types'
import { ComboConfigData } from '../Components/multi-combobox/multiComboboxContainer'
import { ComboboxItem, ComboboxType } from '../Components/multi-combobox/types'
import useMultiComboboxOnChange from '../Components/multi-combobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../Components/multi-combobox/useMultiComboboxOnKeyDown'
import { SlashComboboxItem } from '../Components/SlashCommands/SlashComboboxItem'
import { TagComboboxItem } from '../Components/tag/components/TagComboboxItem'
import { ELEMENT_TAG } from '../Components/tag/defaults'

const useEditorPluginConfig = (editorId: string) => {
  const tags = useDataStore((state) => state.tags)
  const ilinks = useDataStore((state) => state.ilinks)
  const slashCommands = useDataStore((state) => state.slashCommands)
  const nodeid = useEditorStore((state) => state.node.nodeid)
  const actionGroups = useActionsCache((store) => store.actionGroups)
  const groupedActions = useActionsCache((store) => store.groupedActions)
  const mentionable = useMentionStore((state) => state.mentionable)
  const invitedUsers = useMentionStore((state) => state.invitedUsers)
  const prefillShareModal = useShareModalStore((state) => state.prefillModal)

  const addTag = useDataStore((state) => state.addTag)
  const addILink = useDataStore((state) => state.addILink)
  const { setActionsInList } = useActions()
  const { getSnippetsConfigs } = useSnippets()
  // const { getSyncBlockConfigs } = useSyncConfig()
  const { openReminderModal } = useOpenReminderModal()

  // Combobox
  const snippetConfigs = getSnippetsConfigs()
  // const syncBlockConfigs = getSyncBlockConfigs()

  const { params, location } = useRouting()

  const ilinksForCurrentNode = useMemo(() => {
    if (params.snippetid) return ilinks

    return ilinks.filter((item) => item.nodeid !== nodeid)
  }, [nodeid, ilinks])

  const slashInternals = useMemo(() => {
    const snippetName = (location?.state as any)?.title
    if (params.snippetid && snippetName) {
      return slashCommands.internal.filter((item) => snippetName !== item.text)
    }

    return slashCommands.internal
  }, [slashCommands.internal])

  const getActionGroups = () => {
    const groups = {}
    Object.values(actionGroups).forEach((group) => {
      groups[group.actionGroupId] = {
        slateElementType: ELEMENT_ACTION_BLOCK,
        command: group.actionGroupId
      }
    })

    return groups
  }

  const getActionList = () => {
    const groups = Object.keys(actionGroups)
    const actionList = []

    groups.map((actionGroupId) => {
      const actions = setActionsInList(actionGroupId, false).map((action) => ({
        value: actionGroupId,
        text: action.title,
        type: CategoryType.action,
        icon: action.icon,
        command: actionGroupId,
        extras: {
          actionContext: {
            actionId: action.id,
            actionGroupId
          }
        }
      }))

      actionList.push(...actions)
    })

    return actionList
  }

  // const getActionsData = () => {
  //   const groups = Object.values(actionGroups).map((group) => ({
  //     value: group.actionGroupId,
  //     text: group.name,
  //     type: CategoryType.action,
  //     icon: group.icon,
  //     command: group.actionGroupId
  //   }))

  //   return groups
  // }

  const internals: ComboboxItem[] = [
    ...ilinksForCurrentNode.map((l) => ({
      ...l,
      value: l.nodeid,
      text: l.path,
      icon: l.icon ?? 'ri:file-list-2-line',
      type: QuickLinkType.backlink
    })),
    ...slashInternals.map((l) => ({ ...l, value: l.command, text: l.text, type: l.type }))
  ]

  const mentions = [
    ...mentionable.map((m) => ({
      value: m.userid,
      text: m.alias,
      icon: 'ri:user-line',
      type: QuickLinkType.mentions
    })),
    ...invitedUsers.map((m) => ({
      value: m.alias,
      text: m.alias,
      icon: 'ri:user-line',
      type: QuickLinkType.mentions
    }))
  ]
  const comboConfigData: ComboConfigData = {
    keys: {
      inline_block: {
        slateElementType: ELEMENT_INLINE_BLOCK,
        newItemHandler: (newItem, parentId?) => {
          const link = addILink({ ilink: newItem, parentId })
          return link.nodeid
        },
        renderElement: ILinkComboboxItem
      },
      tag: {
        slateElementType: ELEMENT_TAG,
        newItemHandler: (newItem) => {
          addTag(newItem)
          return newItem
        },
        renderElement: TagComboboxItem
      },
      mention: {
        slateElementType: ELEMENT_MENTION,
        newItemHandler: (newAlias) => {
          // addTag(newItem)
          mog('ELEMENT_MENTIONS', { newAlias })
          prefillShareModal('invite', newAlias, true)
          return newAlias
        },
        renderElement: TagComboboxItem
      },
      slash_command: {
        slateElementType: 'slash_command',
        newItemHandler: () => undefined,
        renderElement: SlashComboboxItem
      },
      internal: {
        slateElementType: 'internal',
        newItemHandler: (newItem, parentId?) => {
          const link = addILink({ ilink: newItem, parentId })
          return link.nodeid
        },
        renderElement: SlashComboboxItem
      }
    },
    internal: {
      ilink: {
        slateElementType: ELEMENT_ILINK,
        newItemHandler: (newItem, parentId?) => {
          const link = addILink({ ilink: newItem, parentId })
          // mog('Link', { link, newItem, parentId })
          return link.nodeid
        },
        renderElement: ILinkComboboxItem
      },
      commands: {
        ...snippetConfigs
        // ...syncBlockConfigs
      }
    },
    slashCommands: {
      ...getActionGroups(),
      webem: {
        slateElementType: ELEMENT_MEDIA_EMBED,
        command: 'webem',
        options: {
          url: 'http://example.com/'
        }
      },
      excalidraw: {
        slateElementType: ELEMENT_EXCALIDRAW,
        command: 'canvas'
      },
      table: {
        slateElementType: ELEMENT_TABLE,
        command: 'table'
      },
      remind: {
        slateElementType: ELEMENT_PARAGRAPH,
        command: 'remind',
        onExtendedCommand: (newValue, editor) => {
          openReminderModal(newValue)
        }
      }

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
    }
  }

  const OnChangeConf: Record<string, ComboboxType> = {
    internal: {
      cbKey: ComboboxKey.INTERNAL,
      trigger: '[[',
      blockTrigger: ':',
      data: internals,
      icon: 'ri:file-list-2-line'
    },
    tag: {
      cbKey: ComboboxKey.TAG,
      trigger: '#',
      data: tags.map((t) => ({ ...t, text: t.value })),
      icon: 'ri:hashtag'
    },
    mention: {
      cbKey: ComboboxKey.MENTION,
      trigger: '@',
      data: mentions,
      icon: 'ri:at-line'
    },
    slash_command: {
      cbKey: ComboboxKey.SLASH_COMMAND,
      trigger: '/',
      icon: 'ri:flask-line',
      data: [
        ...getActionList(),
        ...slashCommands.default.map((l) => ({ ...l, value: l.command, type: CategoryType.action, text: l.text }))
      ]
    }
  }

  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, OnChangeConf),

      onKeyDown: useMultiComboboxOnKeyDown(comboConfigData)
    }
  }

  return { pluginConfigs, comboConfigData }
}

export default useEditorPluginConfig
