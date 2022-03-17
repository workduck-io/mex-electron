import { UseComboboxReturnValue } from 'downshift'
import { Range } from 'slate'
import { ComboSearchType } from '../multi-combobox/types'
import { createStore, setStoreValue } from '../store/createStore'
import { IComboboxItem } from './components/Combobox.types'

export enum ComboboxKey {
  TAG = 'tag',
  INTERNAL = 'internal',
  INLINE_BLOCK = 'inline_block',
  SLASH_COMMAND = 'slash_command',
  BLOCK = 'block'
}

export type ComboboxState = {
  // Combobox key
  key: string
  setKey: (value: string) => void

  // Maximum number of suggestions
  maxSuggestions: number
  setMaxSuggestions: (value: number) => void

  // Tag search value
  search: ComboSearchType
  setSearch: (value: ComboSearchType) => void

  // Fetched tags
  items: IComboboxItem[]
  setItems: (value: IComboboxItem[]) => void

  isBlockTriggered: boolean
  setIsBlockTriggered: (value: boolean) => void

  // Range from the tag trigger to the cursor
  targetRange: Range | null
  setTargetRange: (value: Range | null) => void

  // Highlighted index
  itemIndex: number
  setItemIndex: (value: number) => void

  showPreview: boolean
  setShowPreview: (value: boolean) => void

  combobox: UseComboboxReturnValue<IComboboxItem> | null
  setCombobox: (value: UseComboboxReturnValue<IComboboxItem>) => void

  closeMenu: () => void
}

export const useComboboxStore = createStore()<ComboboxState>((set) => ({
  key: ComboboxKey.TAG,
  setKey: setStoreValue(set, 'key', 'setKey'),

  isBlockTriggered: false,
  setIsBlockTriggered: setStoreValue(set, 'isBlockTriggered', 'setIsBlockTriggered'),

  maxSuggestions: 10,
  setMaxSuggestions: setStoreValue(set, 'maxSuggestions', 'setMaxSuggestions'),

  search: { textAfterTrigger: '' },
  setSearch: setStoreValue(set, 'search', 'setSearch'),

  items: [],
  setItems: setStoreValue(set, 'items', 'setItems'),

  targetRange: null,
  setTargetRange: setStoreValue(set, 'targetRange', 'setTargetRange'),

  itemIndex: 0,
  setItemIndex: setStoreValue(set, 'itemIndex', 'setItemIndex'),

  combobox: null,
  setCombobox: setStoreValue(set, 'combobox', 'setCombobox'),

  closeMenu: () => {
    set((state) => {
      state.targetRange = null
      state.items = []
      state.search = ''
      state.itemIndex = 0
    })
  }
}))
