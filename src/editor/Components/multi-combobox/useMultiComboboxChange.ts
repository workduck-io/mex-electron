import { OnChange, usePlateEditorRef } from '@udecode/plate'
import { useCallback } from 'react'
import { fuzzySearch } from '../../../utils/lib/fuzzySearch'
import { useComboboxOnChange } from '../combobox/hooks/useComboboxOnChange'
import { isInternalCommand } from '../combobox/hooks/useComboboxOnKeyDown'
import { ComboboxKey, useComboboxStore } from '../combobox/useComboboxStore'
import { ComboboxType } from './types'
import { isReservedOrClash } from '../../../utils/lib/paths'
import { useRouting } from '../../../views/routes/urls'
import { useLinks } from '../../../hooks/useLinks'
import { mog, withoutContinuousDelimiter } from '../../../utils/lib/helper'
import { makeQuickLink, QuickLinkType } from '../../../components/mex/NodeSelect/NodeSelect'
import { getTimeInText, toLocaleString } from '../../../utils/time'

export const CreateNewPrefix = `Create `

export const getNewItem = (ct: ComboboxType, searchTerm: string) => {
  let type = QuickLinkType.backlink
  let createNewPrefix = CreateNewPrefix

  switch (ct.cbKey) {
    case 'tag': {
      type = QuickLinkType.tags
      break
    }
    case 'mention': {
      type = QuickLinkType.mentions
      createNewPrefix = 'Invite '
      break
    }
  }

  return {
    key: '__create_new',
    icon: 'ri:add-circle-line',
    type,
    data: true,
    prefix: createNewPrefix,
    text: searchTerm
  }
}

export const getCommandExtended = (search: string, keys: Record<string, ComboboxType>) => {
  const extendedKeys = keys['slash_command'].data.filter((ct) => ct.extended)
  const extendedCommands = extendedKeys
    .filter((ct) => {
      return search.startsWith(ct.value)
    })
    .map((ct) => {
      if (ct.value === 'remind') {
        const searchTerm = search.slice(ct.value.length).trim()
        const parsed = getTimeInText(searchTerm)
        const text = parsed ? toLocaleString(parsed.time) : undefined
        if (searchTerm !== '')
          return { ...ct, text: text ?? `Set Reminder: ${searchTerm}`, search, desc: parsed?.textWithoutTime }
      } else {
        throw new Error('Not implemented')
      }
    })

  const isExtended = extendedKeys.some((ct) => {
    return search.startsWith(ct.value)
  })

  return { isExtended, extendedCommands }
}

// Handle multiple combobox
const useMultiComboboxOnChange = (editorId: string, keys: Record<string, ComboboxType>): OnChange => {
  const editor = usePlateEditorRef(editorId)! // eslint-disable-line @typescript-eslint/no-non-null-assertion

  const closeMenu = useComboboxStore((state) => state.closeMenu)
  const { params } = useRouting()
  const { getPathFromNodeid } = useLinks()

  const setItems = useComboboxStore((state) => state.setItems)

  const comboboxOnChange = useComboboxOnChange({
    editor,
    keys
  })

  // Construct the correct change handler
  const changeHandler = useCallback(() => {
    const res = comboboxOnChange()
    if (!res) return false
    const { search } = res

    if (search === undefined) return false

    const key = useComboboxStore.getState().key

    const ct = keys[key]

    const data = ct.data

    if (!data) return false
    const textAfterTrigger = search.textAfterTrigger

    if (params.snippetid && textAfterTrigger?.startsWith('.')) return

    const { isChild, key: pathKey } = withoutContinuousDelimiter(textAfterTrigger)
    const searchTerm = isChild ? `${getPathFromNodeid(editorId)}${pathKey}` : pathKey

    const searchItems = fuzzySearch(data, searchTerm, (item) => item.text)

    const { isExtended, extendedCommands } = getCommandExtended(search.textAfterTrigger, keys)

    // Create for new item
    if (isExtended) {
      searchItems.unshift(...extendedCommands)
    }

    const groups = (searchTerm !== '' ? searchItems : data)?.reduce((acc, item) => {
      const type = item?.type
      if (!acc[type]) {
        acc[type] = []
      }

      if (!(acc[type].length === 5) || item.extras)
        acc[type].push({
          key: item.value,
          icon: item.icon ?? ct.icon ?? undefined,
          text: item.text,
          extended: item.extended,
          data: item.extras,
          type
        })

      return acc
    }, {} as any)

    const items = Object.values(groups).flat()
    const dataKeys = items.map((i: any) => i.text)

    // Create for new item
    if (
      key !== ComboboxKey.SLASH_COMMAND &&
      key !== ComboboxKey.BLOCK &&
      searchTerm !== '' &&
      searchTerm !== '.' &&
      !isInternalCommand(searchTerm) &&
      !isReservedOrClash(searchTerm, dataKeys)
    ) {
      items.unshift(getNewItem(ct, searchTerm))
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
