import { HelpState } from '../components/mex/Help/Help.types'
import { IpcAction } from '../data/IpcAction'
import create from 'zustand'
import { defaultShortcuts } from '../data/Defaults/shortcuts'
import { ipcRenderer } from 'electron'
import produce from 'immer'
import { persist } from 'zustand/middleware'

export const SHORTCUT_STORE_KEY = 'mex-shortcut-store'

export const useHelpStore = create<HelpState>(
  persist(
    (set, get) => ({
      open: false,
      toggleModal: () =>
        set((state) => ({
          open: !state.open
        })),
      closeModal: () =>
        set({
          open: false
        }),
      clearShortcuts: () => set({ shortcuts: defaultShortcuts }),
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
    }),
    {
      name: SHORTCUT_STORE_KEY,
      partialize: (state) => ({
        shortcuts: state.shortcuts
      })
    }
  )
)
