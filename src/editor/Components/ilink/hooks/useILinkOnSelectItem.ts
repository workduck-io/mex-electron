import {
  getBlockAbove,
  getPluginType,
  moveSelection,
  insertNodes,
  PlateEditor,
  TElement,
  select,
  deleteText,
  insertText,
  isEndPoint
} from '@udecode/plate'
import { useCallback } from 'react'
import { IComboboxItem } from '../../combobox/components/Combobox.types'
import { useComboboxIsOpen } from '../../combobox/selectors/useComboboxIsOpen'
import { useComboboxStore } from '../../combobox/useComboboxStore'
import { ELEMENT_ILINK } from '../defaults'

/**
 * Select the target range, add a ilink node and set the target range to null
 */
export const useILinkOnSelectItem = () => {
  const isOpen = useComboboxIsOpen()
  const targetRange = useComboboxStore((state) => state.targetRange)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return useCallback(
    (editor: PlateEditor, item: IComboboxItem) => {
      const type = getPluginType(editor, ELEMENT_ILINK)

      if (isOpen && targetRange) {
        try {
          const pathAbove = getBlockAbove(editor)?.[1]
          const isBlockEnd = editor.selection && pathAbove && isEndPoint(editor, editor.selection.anchor, pathAbove)

          // insert a space to fix the bug
          if (isBlockEnd) {
            insertText(editor, ' ')
          }

          // select the ilink text and insert the ilink element
          select(editor, targetRange)
          insertNodes<TElement>(editor, {
            type: type as any,
            children: [{ text: '' }],
            value: item.text
          })

          // move the selection after the ilink element
          moveSelection(editor)

          // delete the inserted space
          if (isBlockEnd) {
            deleteText(editor)
          }
        } catch (e) {
          console.error(e)
        }

        return closeMenu()
      }
      return undefined
    },
    [closeMenu, isOpen, targetRange]
  )
}
