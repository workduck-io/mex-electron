import { Range } from 'slate'
import { getParent, isCollapsed, isElement, ELEMENT_CODE_BLOCK, ELEMENT_CODE_LINE, PlateEditor } from '@udecode/plate'
import { ComboboxType, ComboTriggerDataType } from './types'
import { getTextFromTrigger } from '../combobox/utils/getTextFromTrigger'
import { debounce } from 'lodash'
import { ComboTriggerType } from '../combobox/useComboboxStore'

export const getTriggeredData = (
  editor: PlateEditor,
  keys: Array<ComboboxType>,
  trigger: ComboTriggerType | undefined,
  setTrigger: any
): ComboTriggerDataType | undefined => {
  const selection = editor?.selection
  const cursor = Range.start(selection)

  const isCursorAfterTrigger = getTextFromTrigger(editor, {
    at: cursor,
    comboTypes: keys,
    trigger,
    setTrigger
  })

  if (isCursorAfterTrigger) {
    const { range, textAfterTrigger, isBlockTriggered, blockRange, textAfterBlockTrigger } = isCursorAfterTrigger

    // if (!blockSearch) setTrigger(comboboxItem)

    return {
      range,
      key: trigger.cbKey,
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

    const parentEntry = getParent(editor, editor.selection.focus)

    if (!parentEntry) return
    const [node] = parentEntry

    if (isElement(node) && (node.type === ELEMENT_CODE_LINE || node.type === ELEMENT_CODE_BLOCK)) {
      return undefined
    }

    // Check within keys
    // if (!isTrigger) {
    //   Object.values(keys).map((comboType) => {
    //     const data = getTriggeredData(editor, comboType, setIsTrigger, false)
    //     if (data) {
    //       triggerSelection = data
    //     }
    //   })
    // } else {
    triggerSelection = getTriggeredData(editor, Object.values(keys), isTrigger, setIsTrigger)
    // }

    // if (!triggerSelection && isTrigger) {
    //   setIsTrigger(undefined)
    // }

    return triggerSelection
  }

  // We return all that can be set in the useComboboxOnChange-keys function
  return undefined
}

export default getTextFromTriggers
