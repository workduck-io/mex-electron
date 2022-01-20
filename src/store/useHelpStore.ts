import { HelpState } from './Help.types'
import create from 'zustand'
import produce from 'immer'
import { ipcRenderer } from 'electron/renderer'
import { IpcAction } from '../../Spotlight/utils/constants'
import { defaultShortcuts } from '../../Defaults/shortcuts'

export const useHelpStore = create<HelpState>((set, get) => ({
  open: false,
  toggleModal: () =>
    set((state) => ({
      open: !state.open
    })),
  closeModal: () =>
    set({
      open: false
    }),
  changeShortcut: (keybinding) => {
    set(
      produce((draft) => {
        Object.keys(draft.shortcuts).map((k) => {
          // * If key already exists, remove it

          if (draft.shortcuts[k].keystrokes === keybinding.keystrokes) {
            draft.shortcuts[k].keystrokes = ''
          }

          // * New shortcut by user
          if (draft.shortcuts[k].title === keybinding.title) {
            draft.shortcuts[k].keystrokes = keybinding.keystrokes
          }
          if (keybinding.title === draft.shortcuts.showSpotlight.title) {
            ipcRenderer.send(IpcAction.SET_SPOTLIGHT_SHORTCUT, { shortcut: keybinding.keystrokes })
          }

          return k
        })
      })
    )
  },
  shortcuts: defaultShortcuts
}))
