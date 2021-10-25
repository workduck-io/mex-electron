import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { defaultShortcuts } from '../../Defaults/shortcuts'
import tinykeys from 'tinykeys'
import create from 'zustand'
import ShortcutTable from './ShortcutTable'
import { HelpState } from './Help.types'
import { useKeyListener } from '../../Hooks/useCustomShortcuts/useShortcutListener'

export const useHelpStore = create<HelpState>((set, get) => ({
  open: false,
  toggleModal: () =>
    set((state) => ({
      open: !state.open
    })),
  editMode: false,
  setEditMode: (editMode) => set({ editMode }),
  closeModal: () =>
    set({
      open: false
    }),
  changeShortcut: (keybinding) => {
    const shortcuts = get().shortcuts

    Object.keys(shortcuts).map((k) => {
      // * If key already exists, remove it
      if (shortcuts[k].keystrokes === keybinding.keystrokes) {
        shortcuts[k].keystrokes = ''
      }

      // * New shortcut by user
      if (shortcuts[k].title === keybinding.title) {
        shortcuts[k].keystrokes = keybinding.keystrokes
      }

      return k
    })

    set({ shortcuts })
  },
  shortcuts: defaultShortcuts
}))

const HelpModal = () => {
  const open = useHelpStore((store) => store.open)
  const toggleModal = useHelpStore((store) => store.toggleModal)
  const closeModal = useHelpStore((store) => store.closeModal)

  const shortcuts = useHelpStore((store) => store.shortcuts)
  const { shortcutDisabled } = useKeyListener()

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showHelp.keystrokes]: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) toggleModal()
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
