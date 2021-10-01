import React from 'react'
import create from 'zustand'
import Modal from 'react-modal'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { Button } from '../../Styled/Buttons'
import { Note } from '../../Styled/Typography'

export interface ConfirmationModalProps {
  confirmKeyword?: string
  cancelKeyword?: string
  onConfirm: (dataId: string) => void
  onCancel: () => void
}

interface ConfirmationModalStoreState {
  open: boolean
  title: string
  description: string
  dataId: string
  openModal: (dataId: string, title: string, description: string) => void
  closeModal: () => void
}

export const useConfirmationModalStore = create<ConfirmationModalStoreState>((set) => ({
  open: false,
  title: '',
  description: '',
  dataId: '',
  openModal: (dataId, title, description) => set({ open: true, dataId, title, description }),
  closeModal: () =>
    set({
      open: false,
      dataId: '',
      title: '',
      description: ''
    })
}))

const ConfirmationModal = ({ confirmKeyword, cancelKeyword, onCancel, onConfirm }: ConfirmationModalProps) => {
  const open = useConfirmationModalStore((store) => store.open)
  const title = useConfirmationModalStore((store) => store.title)
  const description = useConfirmationModalStore((store) => store.description)
  const dataId = useConfirmationModalStore((store) => store.dataId)
  const closeModal = useConfirmationModalStore((store) => store.closeModal)

  const handleConfirm = () => {
    onConfirm(dataId)
    closeModal()
  }

  const handleCancel = () => {
    onCancel()
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>{title}</ModalHeader>
      <Note>{description}</Note>
      <ModalControls>
        <Button size="large" primary onClick={handleConfirm}>
          {confirmKeyword || 'Confirm'}
        </Button>
        <Button size="large" onClick={handleCancel}>
          {cancelKeyword || 'Cancel'}
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default ConfirmationModal
