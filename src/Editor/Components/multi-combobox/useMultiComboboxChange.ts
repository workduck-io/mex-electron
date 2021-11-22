import { OnChange, useStoreEditorRef } from '@udecode/plate'
import { useCallback } from 'react'
import { fuzzySearch } from '../../../Lib/fuzzySearch'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxOnChange } from '../combobox/hooks/useComboboxOnChange'
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { ComboboxType } from './types'

// Handle multiple combobox
const useMultiComboboxOnChange = (
  editorId: string,
  keys: {
    [type: string]: ComboboxType
  }
): OnChange => {
  const editor = useStoreEditorRef(editorId)! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const isOpen = useComboboxIsOpen()
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  const maxSuggestions = useComboboxStore((state) => state.maxSuggestions)
  const setItems = useComboboxStore((state) => state.setItems)

  const comboboxKey = useComboboxStore((state) => state.key)
  const comboType = keys[comboboxKey]

  const comboboxOnChange = useComboboxOnChange({
    editor,
    keys
  })

  const { data } = comboType

  // Construct the correct change handler
  const changeHandler = useCallback(() => {
    const res = comboboxOnChange()
    if (!res) return false

    const { search } = res

    if (!search || !data) return false

    const searchItems = fuzzySearch(data, search, { keys: ['text'] })

    const items: IComboboxItem[] = searchItems.slice(0, maxSuggestions).map((item) => ({
      key: item.value,
      text: item.text
    }))

    if (comboboxKey !== ComboboxKey.SLASH_COMMAND) {
      items.push({
        key: '__create_new',
        text: `Create New ${search}`
      })
    }

    setItems(items)

    return true
  }, [comboboxOnChange, maxSuggestions, setItems, data])

  return useCallback(
    () => () => {
      let changed: boolean | undefined = false
      changed = changeHandler !== undefined ? changeHandler() : false
      if (changed) return

      if (!changed && isOpen) closeMenu()
    },
    [closeMenu, isOpen, changeHandler]
  )
}

export default useMultiComboboxOnChange
