import { getBlockAbove, getPluginType, insertNodes, PlateEditor, TElement } from '@udecode/plate'
import { useCallback } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { IComboboxItem } from '../../combobox/components/Combobox.types'
import { useComboboxIsOpen } from '../../combobox/selectors/useComboboxIsOpen'
import { useComboboxStore } from '../../combobox/useComboboxStore'
import { ELEMENT_TAG } from '../defaults'

/**
 * Select the target range, add a tag node and set the target range to null
 */
export const useTagOnSelectItem = () => {
  const isOpen = useComboboxIsOpen()
  const targetRange = useComboboxStore((state) => state.targetRange)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return useCallback(
    (editor: PlateEditor & ReactEditor, item: IComboboxItem) => {
      const type = getPluginType(editor, ELEMENT_TAG)

      if (isOpen && targetRange) {
        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && Editor.isEnd(editor, editor.selection.anchor, pathAbove)

        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ')
        }

        // select the tag text and insert the tag element
        Transforms.select(editor, targetRange)
        insertNodes<TElement>(editor, {
          type: type as any,
          children: [{ text: '' }],
          value: item.text
        })
        // move the selection after the tag element
        Transforms.move(editor)

        // delete the inserted space
        if (isBlockEnd) {
          Transforms.delete(editor)
        }

        return closeMenu()
      }
      return undefined
    },
    [closeMenu, isOpen, targetRange]
  )
}
