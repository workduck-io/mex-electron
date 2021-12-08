import { getBlockAbove, getPlatePluginType, insertNodes, PlateEditor, TElement } from '@udecode/plate'
import { useCallback } from 'react'
import { Editor, Transforms } from 'slate'
import useAnalytics from '../../../analytics'
import { ActionType } from '../../../analytics/events'
import { isElder } from '../../../Components/Sidebar/treeUtils'
import { getEventNameFromElement } from '../../../Lib/strings'
import { useSnippets } from '../../../Snippets/useSnippets'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { SlashCommandConfig } from './Types'

export const useSlashCommandOnChange = (keys: { [type: string]: SlashCommandConfig }) => {
  const isOpen = useComboboxIsOpen()
  const targetRange = useComboboxStore((state) => state.targetRange)
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { trackEvent } = useAnalytics()

  const { getSnippetContent } = useSnippets()

  return useCallback(
    (editor: PlateEditor, item: IComboboxItem) => {
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

          const eventName = getEventNameFromElement('Editor', ActionType.USE, 'Snippet')
          trackEvent(eventName, { 'mex-content': content })

          if (content) {
            Transforms.select(editor, targetRange)
            insertNodes<TElement>(editor, content)
          }
        } else {
          // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
          const type = getPlatePluginType(editor, commandConfig.slateElementType)
          const data = commandConfig.getBlockData ? commandConfig.getBlockData(item) : {}

          // console.log('INSERT: ', { type, data })

          const eventName = getEventNameFromElement('Editor', ActionType.CREATE, type)
          trackEvent(eventName, { 'mex-type': type, 'mex-data': data })

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
