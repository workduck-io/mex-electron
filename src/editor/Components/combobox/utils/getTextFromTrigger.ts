import { escapeRegExp, getText } from '@udecode/plate-core'
import { BaseRange, Editor, Point } from 'slate'
import { mog } from '../../../../utils/lib/helper'
import { ComboboxType } from '../../multi-combobox/types'
import { ComboTriggerType } from '../useComboboxStore'

/**
 * Get text and range from trigger to cursor.
 * Starts with trigger and ends with non-whitespace character.
 */
export type TriggerOptions = {
  at: Point
  comboTypes: Array<ComboboxType>
  trigger: ComboTriggerType | undefined
  setTrigger: any
  searchPattern?: string
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

  const escapedTrigger = escapeRegExp('/')
  const triggerRegex = new RegExp(`(?:^)${escapedTrigger}`)

  // return null

  if (options.trigger) {
    const start = options.trigger.at
    const at = options.at
    let blockStart: Point | undefined = options.at

    const range = start && Editor.range(editor, start, at)
    const text = getText(editor, range)

    // * Limit user to enter 100 characters or less for ILINKS
    if (text.length > 100) return undefined

    const textAfterTrigger = text.substring(options.trigger.trigger.length, at.offset)

    const lastCharAt = Editor.before(editor, options.at)
    const charRange = lastCharAt && Editor.range(editor, lastCharAt, options.at)
    const charText = getText(editor, charRange)

    const res = {
      range,
      textAfterTrigger
    }

    if (options.trigger.blockAt) {
      const blockRange = Editor.range(editor, options.trigger.blockAt, options.at)
      const blockText = getText(editor, blockRange)

      return {
        ...res,
        blockRange,
        isBlockTriggered: true,
        textAfterBlockTrigger: blockText
      }
    }

    if (charText === options.trigger.blockTrigger) {
      blockStart = start
    }

    return res
  }

  let start: Point | undefined = options.at
  let end: Point | undefined

  start = Editor.before(editor, start, { distance: 2 })
  const charRange = start && Editor.range(editor, start, options.at)
  const charText = getText(editor, charRange)

  options.comboTypes.forEach((comboType) => {
    if (charText.trim() === comboType.trigger) {
      options.setTrigger({ ...comboType, at: start })
    }
  })

  if (!charRange || !charText) return null

  // if (options.at)
  //   if (charText === options.searchPattern) {
  //     blockStart = start
  //   }

  // mog('CHAR_TEXT', { charText }, { pretty: true })

  // if (charText === '/') {
  // }
  // eslint-disable-next-line no-constant-condition
  // while (true) {
  //   end = start
  //   if (!start) break

  //   start = Editor.before(editor, start)
  //   const charRange = start && Editor.range(editor, start, end)
  //   const charText = getText(editor, charRange)

  //   if (charText === options.blockTrigger) {
  //     blockStart = start
  //   }

  //   // * Uncomment this (changes)

  //   if (!charText.match(searchPattern)) {
  //     start = end
  //     break
  //   }
  // }

  // // Range from start to cursor
  // const range = start && Editor.range(editor, start, options.at)
  // const text = getText(editor, range)

  // const triggerIndex = text.indexOf(options.trigger)

  // if (!range || triggerIndex <= -1) return

  // const textStart = { ...start, offset: triggerIndex }
  // const textRange = textStart && Editor.range(editor, textStart, options.at)
  // const triggerText = getText(editor, textRange)

  // if (triggerText.length > 100) return

  // const isBlockTriggered = blockStart.offset !== options.at.offset

  // const res = {
  //   range: textRange,
  //   textAfterTrigger: triggerText.substring(options.trigger.length, blockStart.offset - textStart.offset)
  // }

  // if (isBlockTriggered) {
  //   const blockRange = blockStart && Editor.range(editor, blockStart, options.at)
  //   const blockText = triggerText.substring(blockStart.offset - textStart.offset + 1)

  //   return {
  //     ...res,
  //     isBlockTriggered,
  //     blockRange,
  //     textAfterBlockTrigger: blockText
  //   }
  // }

  return undefined
}
