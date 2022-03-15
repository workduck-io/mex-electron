import { OnChange, usePlateEditorRef } from '@udecode/plate'
import { useCallback } from 'react'
import { fuzzySearch } from '../../../utils/lib/fuzzySearch'
import { IComboboxItem } from '../combobox/components/Combobox.types'
import { useComboboxOnChange } from '../combobox/hooks/useComboboxOnChange'
import { isInternalCommand } from '../combobox/hooks/useComboboxOnKeyDown'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { ComboboxType } from './types'
import { isReservedOrClash } from '../../../utils/lib/paths'
import { useRouting } from '../../../views/routes/urls'
import { useLinks } from '../../../hooks/useLinks'
import { mog, withoutContinuousDelimiter } from '../../../utils/lib/helper'

export const CreateNewPrefix = `Create New `
// Handle multiple combobox
const useMultiComboboxOnChange = (
  editorId: string,
  keys: {
    [type: string]: ComboboxType
  }
): OnChange => {
  const editor = usePlateEditorRef(editorId)! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { params } = useRouting()
  const { getPathFromNodeid } = useLinks()

  const setItems = useComboboxStore((state) => state.setItems)

  const comboboxOnChange = useComboboxOnChange({
    editor,
    keys
  })

  // const { icon } = comboType

  // Construct the correct change handler
  const changeHandler = useCallback(() => {
    const res = comboboxOnChange()
    if (!res) return false
    const { search } = res

    if (search === undefined) return false

    const key = useComboboxStore.getState().key
    const maxSuggestions = useComboboxStore.getState().maxSuggestions

    const ct = keys[key]
    const data = ct.data

    if (!data) return false

    if (params.snippetid && search.startsWith('.')) return

    const { isChild, key: pathKey } = withoutContinuousDelimiter(search)
    const searchTerm = isChild ? `${getPathFromNodeid(editorId)}${pathKey}` : pathKey

    const searchItems = fuzzySearch(data, searchTerm, { keys: ['text'] })
    const items: IComboboxItem[] = (
      searchTerm !== '' ? searchItems.slice(0, maxSuggestions) : keys[key].data.slice(0, maxSuggestions)
    ).map((item) => ({
      key: item.value,
      icon: item.icon ?? ct.icon ?? undefined,
      text: item.text
    }))

    // mog('Change in Combobox', {
    //   data,
    //   dataKeys,
    //   log: !isReservedOrClash(search, dataKeys),
    //   search,
    //   ct,
    //   keys,
    //   key
    // })

    const dataKeys = items.map((i) => i.text)
    // Insert new item conditionally

    if (
      key !== ComboboxKey.SLASH_COMMAND &&
      searchTerm !== '' &&
      searchTerm !== '.' &&
      !isInternalCommand(searchTerm) &&
      !isReservedOrClash(searchTerm, dataKeys)
    ) {
      items.unshift({
        key: '__create_new',
        icon: 'ri:add-circle-line',
        text: `${CreateNewPrefix}${searchTerm}`
      })
    }

    setItems(items)

    return true
  }, [comboboxOnChange, setItems, keys])

  return useCallback(
    () => () => {
      const isOpen = !!useComboboxStore.getState().targetRange

      let changed: boolean | undefined = false
      changed = changeHandler !== undefined ? changeHandler() : false
      if (changed) return

      if (!changed && isOpen) {
        closeMenu()
      }
    },
    [closeMenu, changeHandler, keys]
  )
}

export default useMultiComboboxOnChange
