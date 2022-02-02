import { PEditor, overridePluginsByKey } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'
import { mog } from '../../../../utils/lib/helper'
import { useEditorStore } from '../../../../store/useEditorStore'
import { ComboConfigData } from '../../multi-combobox/multiComboboxContainer'
import { useElementOnChange as getElementOnChange } from '../../multi-combobox/useMultiComboboxOnKeyDown'
import { useSlashCommandOnChange } from '../../SlashCommands/useSlashCommandOnChange'
import { IComboboxItem } from '../components/Combobox.types'
import { ComboboxKey, useComboboxStore } from '../useComboboxStore'
import { getNextWrappingIndex } from '../utils/getNextWrappingIndex'
import { isElder } from '../../../../components/mex/Sidebar/treeUtils'
import { FlowCommandPrefix } from '../../SlashCommands/useSyncConfig'
import { SnippetCommandPrefix } from '../../../../hooks/useSnippets'

const pure = (id: string) => {
  if (id.endsWith(']]')) {
    return id.substr(0, id.length - 2)
  }
  return id
}

export const isInternalCommand = (search?: string) => {
  // mog('mog', {
  //   search,
  //   FlowCommandPrefix,
  //   n: isElder(search, FlowCommandPrefix),
  //   n1: isElder(search, SnippetCommandPrefix),
  //   n2: FlowCommandPrefix.startsWith(search),
  //   n3: SnippetCommandPrefix.startsWith(search)
  // })
  if (search !== undefined && search !== '')
    return (
      isElder(search, FlowCommandPrefix) ||
      isElder(search, SnippetCommandPrefix) ||
      FlowCommandPrefix.startsWith(search) ||
      SnippetCommandPrefix.startsWith(search)
    )
  return false
}

export type OnSelectItem = (editor: PEditor, item: IComboboxItem) => any // eslint-disable-line @typescript-eslint/no-explicit-any
export type OnNewItem = (name: string, parentId?) => void

export const getCreateableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const creatableOnSelect = (editor: any, textVal: string) => {
    const items = useComboboxStore.getState().items
    const currentNodeKey = useEditorStore.getState().node.key
    const itemIndex = useComboboxStore.getState().itemIndex

    const val = pure(textVal)
    if (items[itemIndex]) {
      const item = items[itemIndex]

      // mog('getCreatableInSelect', { item, val, creatable })
      if (item.key === '__create_new' && val !== '') {
        onSelectItem(editor, { key: String(items.length), text: val })
        onNewItem(val, currentNodeKey)
      } else onSelectItem(editor, item)
    } else if (val && creatable) {
      onSelectItem(editor, { key: String(items.length), text: val })
      onNewItem(val, currentNodeKey)
    }
  }

  return creatableOnSelect
}

/**
 * If the combobox is open, handle keyboard
 */
export const useComboboxOnKeyDown = (config: ComboConfigData): KeyboardHandler => {
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  // We need to create the select handlers ourselves here

  const { keys, slashCommands, internal } = config
  const slashCommandOnChange = useSlashCommandOnChange({ ...slashCommands, ...internal.commands })
  const comboboxKey: string = useComboboxStore.getState().key

  const elementOnChange = getElementOnChange(keys[comboboxKey], keys)

  return (editor) => (e) => {
    const comboboxKey: string = useComboboxStore.getState().key

    const comboType = keys[comboboxKey]

    const itemIndex = useComboboxStore.getState().itemIndex
    const search = useComboboxStore.getState().search
    const items = useComboboxStore.getState().items
    const isOpen = !!useComboboxStore.getState().targetRange

    const isSlashCommand =
      comboType.slateElementType === ComboboxKey.SLASH_COMMAND ||
      (comboType.slateElementType === ComboboxKey.INTERNAL && isInternalCommand(search))

    // mog('useComboOnKeyDown', {
    //   config,
    //   isSlashCommand,
    //   c1: comboType.slateElementType === ComboboxKey.SLASH_COMMAND,
    //   c2: isInternalCommand(search),
    //   search,
    //   items,
    //   isOpen,
    //   itemIndex
    // })

    const onSelectItemHandler = isSlashCommand ? slashCommandOnChange : elementOnChange

    const creatabaleOnSelect = getCreateableOnSelect(
      onSelectItemHandler,
      (newItem, parentId?) => {
        if (comboType) comboType.newItemHandler(newItem, parentId)
        if (comboboxKey === ComboboxKey.INTERNAL && !isInternalCommand(search)) {
          internal.ilink.newItemHandler(newItem, parentId)
        }
      },
      comboboxKey !== ComboboxKey.SLASH_COMMAND
    )

    if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()

        const newIndex = getNextWrappingIndex(1, itemIndex, items.length, () => undefined, true)
        return setItemIndex(newIndex)
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()

        const newIndex = getNextWrappingIndex(-1, itemIndex, items.length, () => undefined, true)
        return setItemIndex(newIndex)
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        return closeMenu()
      }

      if (['Tab', 'Enter', ' ', ']'].includes(e.key)) {
        e.preventDefault()
        creatabaleOnSelect(editor, search)
        return false
      }
    }
    return false
  }
}
