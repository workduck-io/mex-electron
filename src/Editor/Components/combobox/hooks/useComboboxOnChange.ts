import { useCallback } from 'react'
import { getPlateEditorRef, TEditor, usePlateEditorRef } from '@udecode/plate'
import { useComboboxStore } from '../useComboboxStore'
import { ComboboxType } from '../../multi-combobox/types'
import getTextFromTriggers from '../../multi-combobox/getMultiTextFromTrigger'

/**
 * If the cursor is after the trigger and at the end of the word:
 * Set target range, set search, reset tag index.
 */
export const useComboboxOnChange = () => {
  const setTargetRange = useComboboxStore((state) => state.setTargetRange)
  const setSearch = useComboboxStore((state) => state.setSearch)
  const setKey = useComboboxStore((state) => state.setKey)

  return useCallback((editor) => {
    // const editor = getPlateEditorRef(editorId)!
    const keys = useComboboxStore.getState().keys
    const textFromTrigger = getTextFromTriggers(editor, keys)
    if (textFromTrigger) {
      const { key, search, range } = textFromTrigger

      setKey(key)
      setTargetRange(range)
      setSearch(search)
      return { search }
    }

    return { search: undefined }
  }, [])
}
