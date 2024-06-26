import { Range } from 'slate'
import {
  getParentNode,
  isCollapsed,
  isElement,
  ELEMENT_CODE_BLOCK,
  ELEMENT_CODE_LINE,
  PlateEditor
} from '@udecode/plate'
import { ComboboxType, ComboTriggerDataType } from './types'
import { getTextFromTrigger } from '../combobox/utils/getTextFromTrigger'
import { debounce } from 'lodash'
import { ComboTriggerType } from '../combobox/useComboboxStore'

export const getTriggeredData = (
  editor: PlateEditor,
  comboboxItem: ComboTriggerType,
  setTrigger: any,
  isTrigger: boolean,
  blockSearch?: boolean
): ComboTriggerDataType | undefined => {
  const selection = editor?.selection
  const cursor = Range.start(selection)

  const isCursorAfterTrigger = getTextFromTrigger(editor, {
    at: cursor,
    trigger: comboboxItem,
    isTrigger
  })

  if (isCursorAfterTrigger) {
    const { range, textAfterTrigger, isBlockTriggered, blockRange, blockStart, textAfterBlockTrigger } =
      isCursorAfterTrigger

    if (!blockSearch || blockStart === undefined) setTrigger({ ...comboboxItem, at: range.anchor, blockAt: blockStart })

    return {
      range,
      key: comboboxItem.cbKey,
      search: { textAfterTrigger, textAfterBlockTrigger },
      isBlockTriggered,
      blockRange
    }
  }

  return undefined
}

const debouncedTriggger = debounce(getTriggeredData, 200)

const getTextFromTriggers = (
  editor: PlateEditor,
  keys: Record<string, ComboboxType>,
  isTrigger: ComboTriggerType | undefined,
  setIsTrigger: any
) => {
  const selection = editor?.selection

  if (selection && isCollapsed(selection)) {
    let triggerSelection

    const parentEntry = getParentNode(editor, editor.selection.focus)

    if (!parentEntry) return
    const [node] = parentEntry

    if (isElement(node) && (node.type === ELEMENT_CODE_LINE || node.type === ELEMENT_CODE_BLOCK)) {
      return undefined
    }

    // Check within keys
    if (!isTrigger) {
      Object.values(keys).map((comboType) => {
        const data = getTriggeredData(editor, comboType, setIsTrigger, false)
        if (data) {
          triggerSelection = data
        }
      })
    } else {
      triggerSelection = getTriggeredData(editor, isTrigger, setIsTrigger, true, !!isTrigger.blockAt)
    }

    if (!triggerSelection && isTrigger) {
      setIsTrigger(undefined)
    }

    return triggerSelection
  }

  // We return all that can be set in the useComboboxOnChange-keys function
  return undefined
}

export default getTextFromTriggers
