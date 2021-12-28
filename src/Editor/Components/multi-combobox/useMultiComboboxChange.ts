import { OnChange, usePlateEditorRef } from '@udecode/plate'
import { useCallback } from 'react'
import { fuzzySearch } from '../../../Lib/fuzzySearch'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxOnChange } from '../combobox/hooks/useComboboxOnChange'
import { useComboboxIsOpen } from '../combobox/selectors/useComboboxIsOpen'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { ComboboxType } from './types'

// Handle multiple combobox
const useMultiComboboxOnChange = (editorId: string): OnChange => {
  // const editor = usePlateEditorRef(editorId)! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const isOpen = useComboboxIsOpen()
  const closeMenu = useComboboxStore((state) => state.closeMenu)

  const maxSuggestions = useComboboxStore((state) => state.maxSuggestions)
  const setItems = useComboboxStore((state) => state.setItems)
  const keys = useComboboxStore((state) => state.keys)

  const comboboxOnChange = useComboboxOnChange()

  console.log('out', { keys })
  const changeHandler = useCallback(
    (editor) => {
      const res = comboboxOnChange(editor)
      console.log('in', { keys })
      if (!res) return false

      const { search } = res
      const key = useComboboxStore.getState().key
      const ct = keys[key]
      const { data } = ct

      if ((!search && search !== '') || !data) return false

      const searchItems = fuzzySearch(data, search, { keys: ['text'] })
      // console.log({ data, search, comboType, key: useComboboxStore.getState().key })

      /** If the search is not empty, use the searchItems
       * otherwise use the default items */
      const items: IComboboxItem[] = (
        search !== '' ? searchItems.slice(0, maxSuggestions) : keys[key].data.slice(0, maxSuggestions)
      ).map((item) => ({
        key: item.value,
        icon: item.icon ?? ct.icon ?? undefined,
        text: item.text
      }))

      // TODO: Disable new item if key exists.
      if (key !== ComboboxKey.SLASH_COMMAND && search !== '') {
        items.push({
          key: '__create_new',
          icon: 'ri:add-circle-line',
          text: `Create New ${search}`
        })
      }

      setItems(items)

      return true
    },
    [maxSuggestions, keys]
  )

  return useCallback(
    (editor) => () => {
      let changed: boolean | undefined = false
      changed = changeHandler !== undefined ? changeHandler(editor) : false
      if (changed) return

      if (!changed && isOpen) closeMenu()
    },
    [isOpen, changeHandler]
  )
}

export default useMultiComboboxOnChange
