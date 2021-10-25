import { defaultShortcuts } from '../../Defaults/shortcuts'

export interface Shortcut {
  title: string
  keystrokes: string
  category: string
  global?: boolean
}

export interface HelpState {
  open: boolean
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  changeShortcut: (keybinding: Shortcut) => void
  shortcuts: Record<keyof typeof defaultShortcuts, Shortcut>
  toggleModal: () => void
  closeModal: () => void
}
