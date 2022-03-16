import { escapeRegExp, getText } from '@udecode/plate-core'
import { Editor, Point } from 'slate'
import { mog } from '../../../../utils/lib/helper'

/**
 * Get text and range from trigger to cursor.
 * Starts with trigger and ends with non-whitespace character.
 */
export const getTextFromTrigger = (
  editor: Editor,
  { at, trigger, searchPattern = `\\D+` }: { at: Point; trigger: string; searchPattern?: string }
) => {
  const escapedTrigger = escapeRegExp(trigger)
  const triggerRegex = new RegExp(`(?:^)${escapedTrigger}`)

  let start: Point | undefined = at
  let end: Point | undefined
  // eslint-disable-next-line no-constant-condition
  while (true) {
    end = start
    if (!start) break

    start = Editor.before(editor, start)
    const charRange = start && Editor.range(editor, start, end)
    const charText = getText(editor, charRange)

    if (!charText.match(searchPattern)) {
      start = end
      break
    }
  }

  // Range from start to cursor
  const range = start && Editor.range(editor, start, at)
  const text = getText(editor, range)

  if (!range || !text.match(triggerRegex)) return

  return {
    range,
    textAfterTrigger: text.substring(trigger.length)
  }
}
