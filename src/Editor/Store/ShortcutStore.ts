import { Key } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import create from 'zustand'

export type ShortcutStoreType = {
  modifiers: Set<string>
  excludedKeys: Set<string>

  editMode: boolean
  setEditMode: (editMode: boolean) => void

  keybinding: string
  setKeyBinding: (keybinding: string) => void

  withModifier: boolean
  setWithModifier: (withModifier: boolean) => void

  shortcut: Array<string>
  addInShortcut: (key: Key) => void
}

export const useShortcutStore = create<ShortcutStoreType>((set, get) => ({
  excludedKeys: new Set(['Tab', 'CapsLock', 'Space', 'Enter', 'Escape']),
  modifiers: new Set(['Control', 'Meta', 'Shift', 'Alt']),

  keybinding: '',
  setKeyBinding: (keybinding: string) => set({ keybinding }),

  editMode: false,
  setEditMode: (editMode: boolean) => set({ editMode }),

  withModifier: false,
  setWithModifier: (withModifier) =>
    set({
      shortcut: []
    }),

  shortcut: [],

  addInShortcut: (key) => {
    const shortcut = get().shortcut

    const keyInShortcut = shortcut.includes(key.name)
    const notExcludedKey = !get().excludedKeys.has(key.name)

    const modifiedShortcut = keyInShortcut ? [key.name] : [...shortcut, key.name]

    if (key.isModifier && notExcludedKey) set({ shortcut: modifiedShortcut, keybinding: modifiedShortcut.join('+') })
  }
}))
