import { SPEditor, getPlatePluginType, getBlockAbove, insertNodes, TElement } from '@udecode/plate'
import { useCallback } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { SlashCommandConfig } from './Types'

export const useSlashCommandOnChange = (keys: { [type: string]: SlashCommandConfig }) => {
  const isOpen = useComboboxIsOpen()
  const targetRange = useComboboxStore((state) => state.targetRange)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  return useCallback(
    (editor: SPEditor & ReactEditor, item: IComboboxItem) => {
      const commandKey = Object.keys(keys).filter((k) => keys[k].command === item.text)[0]

      const commandConfig = keys[commandKey]

      const type = getPlatePluginType(editor, commandConfig.slateElementType)

      if (isOpen && targetRange) {
        // console.log('useElementOnChange 1', { comboType, type });

        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && Editor.isEnd(editor, editor.selection.anchor, pathAbove)

        // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
        // insert a space to fix the bug
        if (isBlockEnd) {
          Transforms.insertText(editor, ' ')
        }

        const data = commandConfig.getBlockData ? commandConfig.getBlockData(item) : {}

        // select the ilink text and insert the ilink element
        Transforms.select(editor, targetRange)
        insertNodes<TElement>(editor, {
          type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          children: [{ text: '' }],
          ...commandConfig.options,
          ...data,
        })

        // console.log('Inserted', { item, type });

        // move the selection after the ilink element
        Transforms.move(editor)

        // delete the inserted space
        if (isBlockEnd) {
          Transforms.delete(editor)
        }

        return closeMenu()
      }
      return undefined
    },
    [closeMenu, isOpen, targetRange, keys]
  )
}
