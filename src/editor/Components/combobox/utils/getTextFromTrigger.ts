import { escapeRegExp, getText } from '@udecode/plate-core'
import { BaseRange, Editor, Point } from 'slate'
import { useEditorStore } from '../../../../store/useEditorStore'
import { mog } from '../../../../utils/lib/helper'
import { useComboboxStore } from '../useComboboxStore'

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

  let start: Point | undefined = options.at
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

    if (!charText.match(searchPattern)) {
      start = end
      break
    }

    // * Uncomment this (changes)
    // if (!options.isTrigger && !charText.match(`\\S+`)) {
    //   start = end
    //   break
    // }
  }

  // Range from start to cursor
  const range = start && Editor.range(editor, start, options.at)
  const text = getText(editor, range)

  if (!range || !text.match(triggerRegex)) return

  const res = {
    range,
    textAfterTrigger: text.substring(options.trigger.length, blockStart.offset)
  }

  const isBlockTriggered = blockStart.offset !== options.at.offset

  if (isBlockTriggered) {
    const blockRange = blockStart && Editor.range(editor, blockStart, options.at)

    return {
      ...res,
      isBlockTriggered,
      blockRange,
      textAfterBlockTrigger: text.substring(blockStart.offset + 1)
    }
  }

  return res
}
