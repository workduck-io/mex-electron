import { useCallback, useEffect, useState } from 'react'
import { useTimeoutFn } from 'react-use'
import { TEditor, getSelectionText, isSelectionExpanded } from '@udecode/plate-core'
import { clearBlurSelection, isBlurSelection } from '../../Plugins/blurSelection'

/**
 * Hide if not selecting.
 *
 * If hiddenDelay = 0 and the selection changes: show.
 * If hiddenDelay > 0: hide when the selection length changes.
 */
export const useBalloonShow = ({ editor, ref, hiddenDelay }: { editor?: TEditor; ref: any; hiddenDelay: number }) => {
  const [hidden, setHidden] = useState(true)

  const selectionExpanded = editor && isSelectionExpanded(editor) // -> Selection start and end are different?
  const selectionText = editor && getSelectionText(editor)
  const isBlurSelected = editor && isBlurSelection(editor as any)

  const show = useCallback(() => {
    if (ref.current && hidden && selectionExpanded) {
      setHidden(false)
    }
  }, [hidden, ref, selectionExpanded])

  const [, , reset] = useTimeoutFn(show, hiddenDelay)

  useEffect(() => {
    if (!hiddenDelay) {
      show()
    }
  }, [selectionText?.length, reset, hiddenDelay, show])

  useEffect(() => {
    clearBlurSelection(editor as any)
  }, [selectionText?.length])

  /**
   * Hide if not selecting.
   * When both blurSelection and selection are null.
   */
  useEffect(() => {
    if (!hidden && !selectionExpanded && !isBlurSelected) {
      setHidden(true)
      if (ref?.current) {
        ref.current?.removeAttribute('style')
      }
    }
  }, [hidden, hiddenDelay, reset, selectionExpanded, show, selectionText?.length, ref, isBlurSelected])

  // useEffect(() => {
  //   if (selected) {
  //     setHidden(() => !selected);
  //   }
  // }, [selected]);

  /**
   * If hiddenDelay > 0:
   * Hide when the selection length changes.
   */
  useEffect(() => {
    if (!hiddenDelay) return

    reset()
    setHidden(true)
  }, [hiddenDelay, selectionText?.length, reset])

  return [hidden]
}
