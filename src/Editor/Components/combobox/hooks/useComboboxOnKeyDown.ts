import { PEditor } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'
import { useCallback } from 'react'
import { useEditorStore } from '../../../Store/EditorStore'
import { IComboboxItem } from '../components/Combobox.types'
import { useComboboxIsOpen } from '../selectors/useComboboxIsOpen'
import { useComboboxStore } from '../useComboboxStore'
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
  const creatableOnSelect = (editor: any, textVal: string) => {
    const items = useComboboxStore.getState().items
    const currentNodeKey = useEditorStore.getState().node.key
    const itemIndex = useComboboxStore.getState().itemIndex

    const val = pure(textVal)
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
export const useComboboxOnKeyDown = ({
  onSelectItem,
  onNewItem,
  creatable
}: {
  onSelectItem: OnSelectItem
  onNewItem: OnNewItem
  creatable?: boolean
}): KeyboardHandler => {
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  const creatabaleOnSelect = useCreatableOnSelect(onSelectItem, onNewItem, creatable)

  return useCallback(
    (editor) => (e) => {
      // if (!combobox) return false;
      const itemIndex = useComboboxStore.getState().itemIndex
      const search = useComboboxStore.getState().search
      const items = useComboboxStore.getState().items
      const isOpen = !!useComboboxStore.getState().targetRange

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
    [creatable, setItemIndex, closeMenu, onSelectItem, onNewItem]
  )
}
