import { PlateEditor } from '@udecode/plate'
import { KeyboardHandler } from '@udecode/plate-core'
import { useCallback } from 'react'
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

/**
 * If the combobox is open, handle keyboard
 */
export const useComboboxOnKeyDown = ({
  onSelectItem,
  onNewItem,
  creatable
}: {
  onSelectItem: (editor: PlateEditor, item: IComboboxItem) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  onNewItem: (name: string) => void
  creatable?: boolean
}): KeyboardHandler => {
  const itemIndex = useComboboxStore((state) => state.itemIndex)
  const setItemIndex = useComboboxStore((state) => state.setItemIndex)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const search = useComboboxStore((state) => state.search)
  const items = useComboboxStore((state) => state.items)
  const isOpen = useComboboxIsOpen()

  const createNew = (textVal: string, editor: any) => {
    closeMenu()
    if (items[itemIndex]) {
      const item = items[itemIndex]
      if (item.key === '__create_new') {
        onSelectItem(editor, { key: String(items.length), text: textVal })
        onNewItem(textVal)
      } else onSelectItem(editor, item)
    } else if (textVal && creatable) {
      // console.log({ search });
      onSelectItem(editor, { key: String(items.length), text: textVal })
      onNewItem(textVal)
    }
  }

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
          createNew(pure(search), editor)
          return false
        }
      }
      return false
    },
    [isOpen, itemIndex, items, creatable, setItemIndex, closeMenu, onSelectItem, onNewItem]
  )
}
