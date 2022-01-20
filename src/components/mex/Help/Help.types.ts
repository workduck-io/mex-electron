import { defaultShortcuts } from '../../../Data/Defaults/shortcuts'

export interface Shortcut {
  title: string
  keystrokes: string
  category: string
  global?: boolean
}

export interface HelpState {
  open: boolean
  changeShortcut: (keybinding: Shortcut) => void
  shortcuts: Record<keyof typeof defaultShortcuts, Shortcut>
  toggleModal: () => void
  closeModal: () => void
}
