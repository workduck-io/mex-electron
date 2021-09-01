import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { defaultShortcuts } from '../../Defaults/shortcuts'
import tinykeys from 'tinykeys'
import create from 'zustand'
import { Button } from '../../Styled/Buttons'
import { ModalControls, ModalHeader } from '../Refactor/styles'

interface Shortcut {
  title: string
  keystrokes: string
  category?: string
}

interface HelpState {
  open: boolean
  shortcuts: Record<keyof typeof defaultShortcuts, Shortcut>
  toggleModal: () => void
  closeModal: () => void
}

export const useHelpStore = create<HelpState>((set) => ({
  open: false,
  toggleModal: () =>
    set((state) => ({
      open: !state.open
    })),

  closeModal: () =>
    set({
      open: false
    }),

  shortcuts: defaultShortcuts
}))

const HelpModal = () => {
  const open = useHelpStore((store) => store.open)
  const toggleModal = useHelpStore((store) => store.toggleModal)
  const closeModal = useHelpStore((store) => store.closeModal)

  const shortcuts = useHelpStore((store) => store.shortcuts)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      [shortcuts.showHelp.keystrokes]: (event) => {
        event.preventDefault()
        toggleModal()
      }
    })
    return () => {
      unsubscribe()
    }
  }, [shortcuts])

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Help</ModalHeader>

      {JSON.stringify(shortcuts)}
      <ModalControls>
        <Button primary size="large">
          Help me pls
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default HelpModal
