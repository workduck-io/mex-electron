import { getBlockAbove, getPlatePluginType, insertNodes, SPEditor, TElement } from '@udecode/plate'
import { useCallback } from 'react'
import { Editor, Transforms } from 'slate'
import { ReactEditor } from 'slate-react'
import { isElder } from '../../../Components/Sidebar/treeUtils'
import { useSnippets } from '../../../Snippets/useSnippets'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { SlashCommandConfig } from './Types'

export const useSlashCommandOnChange = (keys: { [type: string]: SlashCommandConfig }) => {
  const isOpen = useComboboxIsOpen()
  const targetRange = useComboboxStore((state) => state.targetRange)
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  const { getSnippetContent } = useSnippets()

  return useCallback(
    (editor: SPEditor & ReactEditor, item: IComboboxItem) => {
      const commandKey = Object.keys(keys).filter((k) => keys[k].command === item.text)[0]

      const commandConfig = keys[commandKey]
      // console.log({ commandConfig })

      if (isOpen && targetRange) {
        // console.log('useElementOnChange 1', { comboType, type });

        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && Editor.isEnd(editor, editor.selection.anchor, pathAbove)

        // Snippets are handled differently as the content comes from the snippet and not created
        if (isElder(commandKey, 'snip')) {
          const content = getSnippetContent(commandConfig.command)
          if (content) {
            Transforms.select(editor, targetRange)
            insertNodes<TElement>(editor, content)
          }
        } else {
          // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
          const type = getPlatePluginType(editor, commandConfig.slateElementType)
          const data = commandConfig.getBlockData ? commandConfig.getBlockData(item) : {}

          Transforms.select(editor, targetRange)
          insertNodes<TElement>(editor, {
            type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            children: [{ text: '' }],
            ...commandConfig.options,
            ...data
          })

          // move the selection after the inserted content
          Transforms.move(editor)
        }

        return closeMenu()
      }
      return undefined
    },
    [closeMenu, isOpen, targetRange, keys]
  )
}
