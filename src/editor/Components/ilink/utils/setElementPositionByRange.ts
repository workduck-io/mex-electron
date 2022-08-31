import { PlateEditor, Value, toDOMRange } from '@udecode/plate'
import { mog } from '@utils/lib/helper'
import { Range } from 'slate'

/**
 * Set element position below a range.
 */
export const setElementPositionByRange = (editor: PlateEditor<Value>, { ref, at }: { ref: any; at: Range | null }) => {
  if (!at) return

  const el = ref.current
  if (!el) return

  const domRange = toDOMRange(editor, at)
  const rect = domRange.getBoundingClientRect()
  el.style.top = `${rect.top + window.pageYOffset + 24}px`
  el.style.left = `${rect.left + window.pageXOffset}px`
}
