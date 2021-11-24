import { getSelectionText, isSelectionExpanded, TEditor } from '@udecode/plate-core'
import { useEffect } from 'react'
import { setPositionAtSelection } from './setPositionAtSelection'

/**
 * Move when the selection changes.
 */
export const useBalloonMove = ({
  editor,
  ref,
  direction
}: {
  editor?: TEditor
  ref: any
  direction: 'top' | 'bottom'
}) => {
  const selectionExpanded = editor && isSelectionExpanded(editor)
  const selectionText = editor && getSelectionText(editor)

  useEffect(() => {
    if (ref.current && selectionExpanded) setPositionAtSelection(ref.current, direction)
  }, [direction, selectionText, selectionExpanded, ref])
}
