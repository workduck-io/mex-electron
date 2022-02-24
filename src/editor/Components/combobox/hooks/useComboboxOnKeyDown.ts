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
import { CreateNewPrefix } from '../../multi-combobox/useMultiComboboxChange'

const pure = (id: string) => {
  let newId = id
  if (newId.endsWith(']]')) {
    newId = newId.slice(0, newId.length - 2)
  }
  if (newId.startsWith(CreateNewPrefix)) {
    newId = newId.slice(CreateNewPrefix.length)
  }
  return newId
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
export type OnNewItem = (name: string, parentId?) => string | undefined

export const getCreateableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const creatableOnSelect = (editor: any, selectVal: IComboboxItem | string) => {
    const items = useComboboxStore.getState().items
    const currentNodeKey = useEditorStore.getState().node.path
    const itemIndex = useComboboxStore.getState().itemIndex

    // mog('getCreatableInSelect', { items, selectVal, creatable })

    if (items[itemIndex]) {
      const item = items[itemIndex]
      // mog('getCreatableInSelect', { item, selectVal, creatable })
      if (item.key === '__create_new' && selectVal) {
        const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
        const res = onNewItem(val, currentNodeKey)
        // mog('getCreatableInSelect', { item, val, selectVal, creatable, res })
        mog('Select__CN clause', { val, selectVal, creatable, res })
        if (res) onSelectItem(editor, { key: String(items.length), text: res })
      } else onSelectItem(editor, item)
    } else if (selectVal && creatable) {
      const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
      const res = onNewItem(val, currentNodeKey)
      mog('SelectElse clause', { val, selectVal, creatable, res })
      // onSelectItem(editor, { key: String(items.length), text: res ?? val })
      if (res) onSelectItem(editor, { key: String(items.length), text: val })
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
    const item = items[itemIndex]

    const isSlashCommand =
      comboType.slateElementType === ComboboxKey.SLASH_COMMAND ||
      (comboType.slateElementType === ComboboxKey.INTERNAL && isInternalCommand(item ? item.key : search))

    // mog('useComboOnKeyDown', {
    //   k: e.key,
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
        // mog('CreatableOnSelect', { comboType, comboboxKey, il: internal.ilink })
        if (comboboxKey === ComboboxKey.INTERNAL && !isInternalCommand(search)) {
          // mog('CreatableOnSelect', { comboType, comboboxKey })
          return internal.ilink.newItemHandler(newItem, parentId)
        }
        if (comboType) return comboType.newItemHandler(newItem, parentId)
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
