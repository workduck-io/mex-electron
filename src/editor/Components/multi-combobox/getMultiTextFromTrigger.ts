import { Range } from 'slate'
import { getParent, isCollapsed, TEditor, isElement, ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE } from '@udecode/plate'
import { ComboboxType } from './types'
import { getTextFromTrigger } from '../combobox/utils/getTextFromTrigger'
import { mog } from '../../../utils/lib/helper'

// Gets an object with different keys
// Returns the search and key
// Trigger should not be prefixes of other triggers
export default function getTextFromTriggers(editor: TEditor, keys: Record<string, ComboboxType>) {
  const selection = editor?.selection

  if (selection && isCollapsed(selection)) {
    const cursor = Range.start(selection)

    const parentEntry = getParent(editor, editor.selection.focus)

    if (!parentEntry) return
    const [node] = parentEntry

    if (isElement(node) && (node.type === ELEMENT_CODE_LINE || node.type === ELEMENT_CODE_BLOCK)) {
      return undefined
    }

    // Check within keys
    const selections = Object.keys(keys).map((k) => {
      const comboType = keys[k]

      // const isBlockReferenceTrigger = getTextFromTrigger(editor, {
      //   at: cursor,
      //   trigger: ':'
      // })

      // mog('Cursor', { cursor })

      // if (isBlockReferenceTrigger) {
      //   mog('BLOCK REFERENCE TRIGGERED', { isBlockReferenceTrigger })
      // }

      const isCursorAfterTrigger = getTextFromTrigger(editor, {
        at: cursor,
        trigger: comboType.trigger
      })

      if (isCursorAfterTrigger) {
        const { range, textAfterTrigger } = isCursorAfterTrigger

        return {
          range,
          key: comboType.cbKey,
          search: textAfterTrigger
        }
      }

      return undefined
    })

    // Get the trigger for which the selection in present
    const selected = selections.filter((k) => k !== undefined)

    if (selected.length > 0) {
      return selected[0] // We return the first caught selection
    }
  }
  // We return all that can be set in the useComboboxOnChange-keys function
  return undefined
}
