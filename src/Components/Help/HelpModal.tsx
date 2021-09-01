import React, { useEffect } from 'react'
import Modal from 'react-modal'
import tinykeys from 'tinykeys'
import create from 'zustand'
import { Button } from '../../Styled/Buttons'
import { ModalControls, ModalHeader } from '../Refactor/styles'

interface HelpState {
  open: boolean
  openModal: () => void
  closeModal: () => void
}

export const useHelpStore = create<HelpState>((set) => ({
  open: false,
  openModal: () =>
    set({
      open: true
    }),
  closeModal: () => {
    set({
      open: false
    })
  }
}))

const HelpModal = () => {
  const open = useHelpStore((store) => store.open)

  const openModal = useHelpStore((store) => store.openModal)
  const closeModal = useHelpStore((store) => store.closeModal)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      '$mod+,': (event) => {
        event.preventDefault()
        openModal()
      }
    })
    return () => {
      unsubscribe()
    }
  })

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Help</ModalHeader>

      <ModalControls>
        <Button primary size="large">
          Help me pls
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default HelpModal
