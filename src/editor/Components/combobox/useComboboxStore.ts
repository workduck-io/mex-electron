import { UseComboboxReturnValue } from 'downshift'
import { BaseRange, Point, Range } from 'slate'
import create from 'zustand'
import { useEditorStore } from '../../../store/useEditorStore'
import { ComboSearchType, ComboboxType } from '../multi-combobox/types'
import { IComboboxItem } from './components/Combobox.types'

export enum ComboboxKey {
  TAG = 'tag',
  MENTION = 'mention',
  INTERNAL = 'internal',
  INLINE_BLOCK = 'inline_block',
  SLASH_COMMAND = 'slash_command',
  BLOCK = 'block'
}

export type ComboTriggerType = ComboboxType & { at?: Point; blockAt?: Point }

export type ComboboxState = {
  // Combobox key
  key: string
  setKey: (value: string) => void

  // Maximum number of suggestions
  maxSuggestions: number
  setMaxSuggestions: (value: number) => void

  activeBlock?: any
  setActiveBlock: (block: any) => void

  // Tag search value
  search: ComboSearchType
  setSearch: (value: ComboSearchType) => void

  // Fetched tags
  items: IComboboxItem[]
  setItems: (value: IComboboxItem[]) => void

  isBlockTriggered: boolean
  setIsBlockTriggered: (value: boolean) => void

  blockRange?: BaseRange | null
  setBlockRange: (value: BaseRange) => void

  // Range from the tag trigger to the cursor
  targetRange: Range | null
  setTargetRange: (value: Range | null) => void

  // Highlighted index
  itemIndex: number
  setItemIndex: (value: number) => void

  isSlash: boolean
  setIsSlash: (value: boolean) => void

  preview?: any
  setPreview: (value: any) => void

  showPreview?: boolean
  setShowPreview: (value: boolean) => void

  combobox: UseComboboxReturnValue<IComboboxItem> | null
  setCombobox: (value: UseComboboxReturnValue<IComboboxItem>) => void

  closeMenu: () => void
}

export const useComboboxStore = create<ComboboxState>()((set) => ({
  key: ComboboxKey.TAG,
  setKey: (key) => set({ key }),

  setBlockRange: (blockRange) => set({ blockRange }),

  isSlash: false,
  setIsSlash: (isSlash) => set({ isSlash }),

  isBlockTriggered: false,
  setIsBlockTriggered: (isBlockTriggered) => set({ isBlockTriggered }),

  maxSuggestions: 10,
  setMaxSuggestions: (maxSuggestions) => set({ maxSuggestions }),

  setActiveBlock: (activeBlock) => set({ activeBlock }),
  setPreview: (preview) => set({ preview }),

  search: { textAfterTrigger: '' },
  setSearch: (value) => set({ search: value }),

  items: [],
  setItems: (value) => set({ items: value }),

  targetRange: null,
  setTargetRange: (targetRange) => set({ targetRange }),

  itemIndex: 0,
  setItemIndex: (index) => set({ itemIndex: index }),

  combobox: null,
  setCombobox: (value) => set({ combobox: value }),

  setShowPreview: (value) => set({ showPreview: value }),

  closeMenu: () => {
    useEditorStore.getState().setTrigger(undefined)
    set({
      targetRange: null,
      items: [],
      search: { textAfterTrigger: '' },
      itemIndex: 0
    })
  }
}))
