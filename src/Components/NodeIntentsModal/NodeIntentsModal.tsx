import React from 'react'
import create from 'zustand'
import useIntents from '../../Hooks/useIntents/useIntents'

import Modal from 'react-modal'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { Button } from '../../Styled/Buttons'
import { Note } from '../../Styled/Typography'

export interface NodeIntegrationsModalProps {
  id: string
}

interface NodeIntentsModal {
  open: boolean
  toggleModal: () => void
  openModal: () => void
  closeModal: () => void
}

export const useNodeIntentsModalStore = create<NodeIntentsModal>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  toggleModal: () => set((state) => ({ open: !state.open })),
  closeModal: () =>
    set({
      open: false
    })
}))

const NodeIntentsModal = ({ id }: NodeIntegrationsModalProps) => {
  const { getNodeIntents } = useIntents()
  const intentMap = getNodeIntents(id)
  const closeModal = useNodeIntentsModalStore((store) => store.closeModal)
  const open = useNodeIntentsModalStore((store) => store.open)

  // Get integrations
  // Show list of integrations, with their specific intents

  console.log({ id })

  const onSave = () => {
    console.log('onSave')
    closeModal()
  }

  const onCancel = () => {
    console.log('onCancel')
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Node Intents for {id}</ModalHeader>
      <Note>Node intents are used to sync blocks to specific places of applications.</Note>

      {intentMap.map((i) => (
        <div key={`intents_selection_in_modal_${i.service.id}`}>
          <p>{i.service.id}</p>
          {i.intent ? i.intent.value : 'Specify Intent'}
        </div>
      ))}

      <ModalControls>
        <Button size="large" primary onClick={onSave}>
          Save
        </Button>
        <Button size="large" onClick={onCancel}>
          Cancel
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default NodeIntentsModal
