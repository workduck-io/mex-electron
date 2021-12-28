import { PEditor } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'
import { useCallback } from 'react'
import { ReactEditor } from 'slate-react'
import { useEditorStore } from '../../../Store/EditorStore'
import { useElementOnChange } from '../../multi-combobox/useMultiComboboxOnKeyDown'
import { useSlashCommandOnChange } from '../../SlashCommands/useSlashCommandOnChange'
import { IComboboxItem } from '../components/Combobox.types'
import { useComboboxIsOpen } from '../selectors/useComboboxIsOpen'
import { ComboboxKey, useComboboxStore } from '../useComboboxStore'
import { getNextWrappingIndex } from '../utils/getNextWrappingIndex'

const pure = (id: string) => {
  if (id.endsWith(']]')) {
    return id.substr(0, id.length - 2)
  }
  return id
}

export type OnSelectItem = (editor: PEditor, item: IComboboxItem) => any // eslint-disable-line @typescript-eslint/no-explicit-any
export type OnNewItem = (name: string, parentId?) => void

export const useCreatableOnSelect = (onSelectItem: OnSelectItem, onNewItem: OnNewItem, creatable?: boolean) => {
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const items = useComboboxStore((state) => state.items)
  const currentNodeKey = useEditorStore((state) => state.node.key)

  const creatableOnSelect = (editor: any, textVal: string) => {
    // console.log({ textVal })
    const val = pure(textVal)
    closeMenu()
    if (items[itemIndex]) {
      const item = items[itemIndex]
      // console.log({ items, item })
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
export const useComboboxOnKeyDown = (): KeyboardHandler => {
  const comboboxKey = useComboboxStore((state) => state.key)
  const creatable = comboboxKey !== ComboboxKey.SLASH_COMMAND
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const search = useComboboxStore((state) => state.search)
  const items = useComboboxStore((state) => state.items)
  const isOpen = useComboboxIsOpen()

  const config = useComboboxStore((state) => state.comboConfig)
  const { keys, slashCommands } = config

  const comboType = keys[comboboxKey]
  const onNewItem = (newItem, parentId?) => {
    comboType.newItemHandler(newItem, parentId)
  }

  // SELECT
  const slashCommandOnChange = useSlashCommandOnChange(slashCommands)
  const elementOnChange = useElementOnChange(comboType)
  const isSlash = comboboxKey === ComboboxKey.SLASH_COMMAND

  let onSelectItem: (editor: PEditor & ReactEditor, item: IComboboxItem) => any

  if (isSlash) {
    onSelectItem = slashCommandOnChange
  } else {
    onSelectItem = elementOnChange
  }

  //
  //

  const creatabaleOnSelect = useCreatableOnSelect(onSelectItem, onNewItem, creatable)

  return useCallback(
    (editor) => (e) => {
      // if (!combobox) return false;

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
    },
    [isOpen, itemIndex, items, setItemIndex, closeMenu, onSelectItem, onNewItem]
  )
}
