import { useCallback } from 'react'
import { TEditor } from '@udecode/plate'
import { useComboboxStore } from '../useComboboxStore'
import { ComboboxType } from '../../multi-combobox/types'
import getTextFromTriggers from '../../multi-combobox/getMultiTextFromTrigger'
import { mog } from '../../../../utils/lib/helper'
import {debounce} from 'lodash'

/**
 * If the cursor is after the trigger and at the end of the word:
 * Set target range, set search, reset tag index.
 */
export const useComboboxOnChange = ({
  editor,
  keys
}: {
  editor: TEditor
  keys: {
    [type: string]: ComboboxType
  }
}) => {
  const setTargetRange = useComboboxStore((state) => state.setTargetRange)
  const setSearch = useComboboxStore((state) => state.setSearch)
  const setKey = useComboboxStore((state) => state.setKey)

  return useCallback(() => {
    const textFromTrigger = getTextFromTriggers(editor, keys)

    if (textFromTrigger) {
      const { key, search, range } = textFromTrigger

      setKey(key)
      setTargetRange(range)
      setSearch(search)

      return { search }
    }

    return { search: undefined }
  }, [editor, keys, setKey, setTargetRange, setSearch])
}
