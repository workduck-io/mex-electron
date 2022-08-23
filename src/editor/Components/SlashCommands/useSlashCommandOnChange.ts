import {
  deleteText,
  getBlockAbove,
  getPluginType,
  insertNodes,
  insertTable,
  insertText,
  isEndPoint,
  moveSelection,
  PlateEditor,
  select,
  TElement
} from '@udecode/plate'
import useAnalytics from '../../../services/analytics'
import { ActionType } from '../../../services/analytics/events'
import { isElder } from '../../../components/mex/Sidebar/treeUtils'
import { getEventNameFromElement } from '../../../utils/lib/strings'

import { useSnippets } from '../../../hooks/useSnippets'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxStore } from '../combobox/useComboboxStore'
import { SlashCommandConfig } from './Types'
import { mog } from '../../../utils/lib/helper'
import { defaultContent } from '../../../data/Defaults/baseData'
import { ELEMENT_ACTION_BLOCK } from '../Actions/types'

export const useSlashCommandOnChange = (
  keys: Record<string, SlashCommandConfig>
  // internal: {
  //   [type: string]: SlashCommandConfig
  // }
) => {
  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { trackEvent } = useAnalytics()

  const { getSnippetContent } = useSnippets()

  return (editor: PlateEditor, item: IComboboxItem) => {
    const targetRange = useComboboxStore.getState().targetRange
    const commandKey = Object.keys(keys).filter((k) => keys[k].command === item.key)[0]
    // mog('COMMAND', { commandKey, item, keys: Object.keys(keys) })
    const commandConfig = keys[commandKey]
    // console.log({ commandConfig })
    if (targetRange) {
      try {
        const pathAbove = getBlockAbove(editor)?.[1]
        const isBlockEnd = editor.selection && pathAbove && isEndPoint(editor, editor.selection.anchor, pathAbove)

        if (isElder(commandKey, 'snip')) {
          mog('im here', { commandKey, item, keys })
          const content = getSnippetContent(commandConfig.command)

          const eventName = getEventNameFromElement('Editor', ActionType.USE, 'Snippet')
          trackEvent(eventName, { 'mex-content': content })

          if (content) {
            select(editor, targetRange)
            insertNodes<TElement>(editor, content)
          }
        } else if (item.key === 'table') {
          select(editor, targetRange)
          insertTable(editor, { header: true, rowCount: 3 })
        } else if (item.extended) {
          select(editor, targetRange)
          deleteText(editor)
          const search = useComboboxStore.getState().search
          mog('extended', {
            item,
            commandKey
          })
          commandConfig.onExtendedCommand(search.textAfterTrigger, editor)
        } else {
          const type = getPluginType(editor, commandConfig.slateElementType)
          const data = commandConfig.getBlockData ? commandConfig.getBlockData(item) : {}

          const eventName = getEventNameFromElement('Editor', ActionType.CREATE, type)
          trackEvent(eventName, { 'mex-type': type, 'mex-data': data })
          const itemData = type === ELEMENT_ACTION_BLOCK ? (item.data as any) : {}

          select(editor, targetRange)
          insertNodes<TElement>(editor, {
            type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            children: [{ text: '' }],
            ...commandConfig.options,
            ...data,
            ...itemData
          })

          insertText(editor, ' ')

          // move the selection after the inserted content
          moveSelection(editor)
        }
      } catch (e) {
        console.error(e)
      }
      return closeMenu()
    }

    return undefined
  }
}
