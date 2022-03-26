import { escapeRegExp, getText } from '@udecode/plate-core'
import { BaseRange, Editor, Point } from 'slate'
import { mog } from '../../../../utils/lib/helper'

/**
 * Get text and range from trigger to cursor.
 * Starts with trigger and ends with non-whitespace character.
 */
export type TriggerOptions = {
  at: Point
  trigger: string
  searchPattern?: string
  blockTrigger?: string
  isTrigger?: boolean
}

export type TextFromTrigger = {
  range: BaseRange
  blockRange?: BaseRange
  textAfterTrigger: string
  isBlockTriggered?: boolean
  textAfterBlockTrigger?: string
}

export const getTextFromTrigger = (editor: Editor, options: TriggerOptions): TextFromTrigger => {
  const searchPattern = options.searchPattern ?? `\\D+`

  const escapedTrigger = escapeRegExp(options.trigger)
  const triggerRegex = new RegExp(`(?:^)${escapedTrigger}`)

  let start: Point | undefined = { ...options.at }
  let end: Point | undefined
  let blockStart = options.at

  // eslint-disable-next-line no-constant-condition
  while (true) {
    end = start
    if (!start) break

    start = Editor.before(editor, start)
    const charRange = start && Editor.range(editor, start, end)
    const charText = getText(editor, charRange)

    if (charText === options.blockTrigger) {
      blockStart = start
    }

    // * Uncomment this (changes)

    if (!charText.match(searchPattern)) {
      start = end
      break
    }
  }

  // Range from start to cursor
  const range = start && Editor.range(editor, start, options.at)
  const text = getText(editor, range)

  const triggerIndex = text.indexOf(options.trigger)

  if (!range || triggerIndex <= -1) return

  const textStart = { ...start, offset: triggerIndex }
  const textRange = textStart && Editor.range(editor, textStart, options.at)
  const triggerText = getText(editor, textRange)

  if (triggerText.length > 100) return

  const isBlockTriggered = blockStart.offset !== options.at.offset

  const res = {
    range: textRange,
    textAfterTrigger: triggerText.substring(options.trigger.length, blockStart.offset - textStart.offset)
  }

  if (isBlockTriggered) {
    const blockRange = blockStart && Editor.range(editor, blockStart, options.at)
    const blockText = triggerText.substring(blockStart.offset - textStart.offset + 1)

    return {
      ...res,
      isBlockTriggered,
      blockRange,
      textAfterBlockTrigger: blockText
    }
  }

  return res
}
