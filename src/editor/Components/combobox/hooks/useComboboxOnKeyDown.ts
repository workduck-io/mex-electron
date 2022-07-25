import { PlateEditor } from '@udecode/plate'
import { insertText, KeyboardHandler, select } from '@udecode/plate-core'
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
import { Editor } from 'slate'
import { ComboSearchType } from '../../multi-combobox/types'

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
  if (search !== undefined && search !== '')
    return (
      isElder(search, FlowCommandPrefix) ||
      isElder(search, SnippetCommandPrefix) ||
      FlowCommandPrefix.startsWith(search) ||
      SnippetCommandPrefix.startsWith(search)
    )

  return false
}

export type OnSelectItem = (editor: PlateEditor, item: IComboboxItem, elementType?: string, tab?: boolean) => any // eslint-disable-line @typescript-eslint/no-explicit-any
export type OnNewItem = (name: string, parentId?) => string | undefined

export const getCreateableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const creatableOnSelect = (editor: any, selectVal: IComboboxItem | string, elementType?: string, tab?: boolean) => {
    const items = useComboboxStore.getState().items
    const currentNodeKey = useEditorStore.getState().node.path
    const itemIndex = useComboboxStore.getState().itemIndex

    const item = items[itemIndex]

    if (item) {
      // mog('getCreatableInSelect', { item, selectVal, creatable })
      if (item.key === '__create_new' && selectVal) {
        // mog('getCreatableInSelect using OnNewItem', { item, selectVal, creatable })
        const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
        const res = onNewItem(val, currentNodeKey)
        if (res) {
          onSelectItem(editor, { key: String(items.length), text: res }, elementType, tab)
        }
      } else {
        onSelectItem(editor, item, elementType, tab)
      }
    } else if (selectVal && creatable) {
      const val = pure(typeof selectVal === 'string' ? selectVal : selectVal.text)
      const res = onNewItem(val, currentNodeKey)
      // onSelectItem(editor, { key: String(items.length), text: res ?? val })
      if (res) onSelectItem(editor, { key: String(items.length), text: val }, elementType, tab)
    }
  }

  return creatableOnSelect
}

export const replaceFragment = (editor: any, range: any, text: string) => {
  const sel = editor.selection

  if (sel) {
    select(editor, range)
    insertText(editor, text)
  }
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

  // * Replace textBeforeTrigger with provided text value in editor

  return (editor) => (e) => {
    const comboboxKey: string = useComboboxStore.getState().key

    const comboType = keys[comboboxKey]

    const itemIndex = useComboboxStore.getState().itemIndex
    const isBlockTriggered = useComboboxStore.getState().isBlockTriggered
    const { textAfterTrigger: search }: ComboSearchType = useComboboxStore.getState().search
    const items = useComboboxStore.getState().items
    const targetRange = useComboboxStore.getState().targetRange
    const isOpen = !!targetRange && items.length > 0
    const item = items[itemIndex]

    const isSlashCommand =
      comboType.slateElementType === ComboboxKey.SLASH_COMMAND ||
      (comboType.slateElementType === ComboboxKey.INTERNAL && isInternalCommand(item ? item.key : search))

    // * Is Command is "/" or "[[", select corresponding change handler
    const onSelectItemHandler = isSlashCommand ? slashCommandOnChange : elementOnChange

    const creatabaleOnSelect = getCreateableOnSelect(
      onSelectItemHandler,
      (newItem, parentId?) => {
        if (comboboxKey === ComboboxKey.INTERNAL && !isInternalCommand(search)) {
          return internal.ilink.newItemHandler(newItem, parentId)
        }

        if (comboType) {
          // mog('comoboType', { newItem, comboType, parentId })
          return comboType.newItemHandler(newItem, parentId)
        }
      },
      comboboxKey !== ComboboxKey.SLASH_COMMAND
    )

    if (isOpen) {
      if (!isBlockTriggered) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()

          const newIndex = getNextWrappingIndex(1, itemIndex, items.length, () => undefined, false)

          // * Replace current searched text with list item
          // replaceFragment(editor, targetRange, items[newIndex].text)

          return setItemIndex(newIndex)
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault()

          const newIndex = getNextWrappingIndex(-1, itemIndex, items.length, () => undefined, false)

          // * Replace current searched text with list item
          // replaceFragment(editor, targetRange, items[newIndex].text)

          return setItemIndex(newIndex)
        }

        if (e.key === 'Escape') {
          e.preventDefault()
          return closeMenu()
        }
      }

      if (e.key === 'Tab') {
        // * On Tab insert the selected item as Inline Block
        e.preventDefault()
        creatabaleOnSelect(editor, search, undefined, true)
        return false
      }
      // }

      if (['Enter', ']'].includes(e.key)) {
        e.preventDefault()

        // * On Enter insert the selected item
        creatabaleOnSelect(editor, search)
        return false
      }
    }
    return false
  }
}
