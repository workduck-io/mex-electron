import { Range } from 'slate'
import { getParent, isCollapsed, isElement, ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE, PlateEditor } from '@udecode/plate'
import { ComboboxType, ComboTriggerDataType } from './types'
import { getTextFromTrigger } from '../combobox/utils/getTextFromTrigger'
import { debounce } from 'lodash'

export const getTriggeredData = (
  editor: PlateEditor,
  comboboxItem: ComboboxType,
  setTrigger: any,
  blockSearch?: boolean
): ComboTriggerDataType | undefined => {
  const selection = editor?.selection
  const cursor = Range.start(selection)

  const isCursorAfterTrigger = getTextFromTrigger(editor, {
    at: cursor,
    trigger: comboboxItem.trigger,
    blockTrigger: comboboxItem.blockTrigger
  })

  if (isCursorAfterTrigger) {
    const { range, textAfterTrigger, isBlockTriggered, textAfterBlockTrigger } = isCursorAfterTrigger

    if (!blockSearch) setTrigger(comboboxItem)

    return {
      range,
      key: comboboxItem.cbKey,
      search: { textAfterTrigger, textAfterBlockTrigger },
      isBlockTriggered
    }
  }

  return undefined
}

const debouncedTriggger = debounce(getTriggeredData, 200)

const getTextFromTriggers = (
  editor: PlateEditor,
  keys: Record<string, ComboboxType>,
  isTrigger: ComboboxType | undefined,
  setIsTrigger: any
) => {
  const selection = editor?.selection

  if (selection && isCollapsed(selection)) {
    let triggerSelection

    const parentEntry = getParent(editor, editor.selection.focus)

    if (!parentEntry) return
    const [node] = parentEntry

    if (isElement(node) && (node.type === ELEMENT_CODE_LINE || node.type === ELEMENT_CODE_BLOCK)) {
      return undefined
    }

    // Check within keys
    if (!isTrigger) {
      Object.values(keys).map((comboType) => {
        const data = getTriggeredData(editor, comboType, setIsTrigger)
        if (data) {
          triggerSelection = data
        }
      })
    } else {
      triggerSelection = getTriggeredData(editor, isTrigger, setIsTrigger, !!isTrigger.blockTrigger)
    }

    if (!triggerSelection && isTrigger) setIsTrigger(undefined)

    return triggerSelection
  }

  // We return all that can be set in the useComboboxOnChange-keys function
  return undefined
}

export default getTextFromTriggers
