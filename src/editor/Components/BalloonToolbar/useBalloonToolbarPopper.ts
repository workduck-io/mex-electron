import { useCallback, useEffect, useState } from 'react'
import {
  getSelectionText,
  isSelectionExpanded,
  useEventEditorSelectors,
  usePlateEditorState
} from '@udecode/plate-core'
import { getSelectionBoundingClientRect, usePopperPosition, UsePopperPositionOptions } from '@udecode/plate-ui-popper'
import { clearBlurSelection, isBlurSelection } from '../../../editor/Plugins/blurSelection'
import { mog } from '../../../utils/lib/helper'

export const useBalloonToolbarPopper = (options: UsePopperPositionOptions) => {
  const focusId = useEventEditorSelectors.focus()
  const editor = usePlateEditorState(focusId!)!

  const [isHidden, setIsHidden] = useState(true)

  const selectionExpanded = editor && isSelectionExpanded(editor)
  const selectionText = editor && getSelectionText(editor)
  const isBlurSelected = editor && isBlurSelection(editor as any)

  const show = useCallback(() => {
    mog('Balloon show laddies', { selectionText, selectionExpanded, isBlurSelected })
    if (isHidden && selectionExpanded) {
      setIsHidden(false)
    }
  }, [isHidden, selectionExpanded])

  // useEffect(() => {
  //   clearBlurSelection(editor as any)
  // }, [selectionText?.length])

  useEffect(() => {
    mog('Balloon show gentlemen', { selectionText, selectionExpanded, isBlurSelected })
    if (!selectionText) {
      setIsHidden(true)
    } else if (selectionText && selectionExpanded) {
      setIsHidden(false)
    }
  }, [selectionExpanded, selectionText, show, isBlurSelected])

  const popperResult = usePopperPosition({
    isHidden,
    getBoundingClientRect: getSelectionBoundingClientRect,
    ...options
  })

  const selectionTextLength = selectionText?.length ?? 0
  const { update } = popperResult

  useEffect(() => {
    selectionTextLength > 0 && update?.()
  }, [selectionTextLength, update])

  return popperResult
}
