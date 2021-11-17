import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { defaultShortcuts } from '../../Defaults/shortcuts'
import tinykeys from 'tinykeys'
import create from 'zustand'
import ShortcutTable from './ShortcutTable'
import produce from 'immer'
import { HelpState } from './Help.types'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'
import { ipcRenderer } from 'electron'
import { IpcAction } from '../../Spotlight/utils/constants'

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

const HelpModal = () => {
  const open = useHelpStore((store) => store.open)
  const toggleModal = useHelpStore((store) => store.toggleModal)
  const closeModal = useHelpStore((store) => store.closeModal)

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled, shortcutHandler } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showHelp.keystrokes]: (event) => {
        event.preventDefault()
        shortcutHandler(shortcuts.showHelp, () => {
          toggleModal()
        })
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts, shortcutDisabled])

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ShortcutTable />
    </Modal>
  )
}

export default HelpModal
