import {
  useEventEditorSelectors,
  usePlateSelection,
  usePlateEditorState,
  isSelectionExpanded,
  getSelectionText
} from '@udecode/plate'
import { useEffect } from 'react'
import { mog } from '../utils/lib/helper'

export const useEditorSelection = () => {
  const focusId = useEventEditorSelectors.focus()
  const editor = usePlateEditorState(focusId!)!

  const selection = usePlateSelection(focusId!)

  const selectionExpanded = editor && isSelectionExpanded(editor)
  const selectionText = editor && getSelectionText(editor)

  useEffect(() => {
    document.addEventListener('contextmenu', () => {
      mog('SELECTION', { selectionExpanded, selectionText, selection })
    })
  }, [selection])
}
