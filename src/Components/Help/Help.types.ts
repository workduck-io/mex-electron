import { defaultShortcuts } from '../../Defaults/shortcuts'

export interface Shortcut {
  title: string
  keystrokes: string
  category: string
}

export interface HelpState {
  open: boolean
  shortcuts: Record<keyof typeof defaultShortcuts, Shortcut>
  toggleModal: () => void
  closeModal: () => void
}
