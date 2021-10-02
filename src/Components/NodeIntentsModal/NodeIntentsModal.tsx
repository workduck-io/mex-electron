import React from 'react'
import create from 'zustand'
import useIntents from '../../Hooks/useIntents/useIntents'

import Modal from 'react-modal'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { Button } from '../../Styled/Buttons'
import { Note } from '../../Styled/Typography'
import IntentSelector from '../../Editor/Components/SyncBlock/intentSelector'
import { IntentMapItem } from '../../Styled/Integrations'
import { Intent } from '../../Editor/Components/SyncBlock'

export interface NodeIntegrationsModalProps {
  id: string
}

interface NodeIntentsModal {
  open: boolean
  intents: { [id: string]: Intent }
  toggleModal: () => void
  openModal: () => void
  closeModal: () => void
  appendIntent: (intent: Intent) => void
}

export const useNodeIntentsModalStore = create<NodeIntentsModal>((set) => ({
  open: false,
  intents: {},
  openModal: () => set({ open: true }),
  toggleModal: () => set((state) => ({ open: !state.open })),
  closeModal: () =>
    set({
      open: false
    }),
  appendIntent: (intent) =>
    set((state) => ({
      intents: {
        ...state.intents,
        [intent.service]: intent
      }
    }))
}))

const NodeIntentsModal = ({ id }: NodeIntegrationsModalProps) => {
  const { getNodeIntents, updateNodeIntents } = useIntents()
  const intentMap = getNodeIntents(id)
  const closeModal = useNodeIntentsModalStore((store) => store.closeModal)
  const open = useNodeIntentsModalStore((store) => store.open)
  const intents = useNodeIntentsModalStore((store) => store.intents)
  const appendIntent = useNodeIntentsModalStore((store) => store.appendIntent)

  const onSave = () => {
    console.log('onSave', intents)
    // Replace intents in intents and specific intent groups
    updateNodeIntents(
      id,
      Object.keys(intents).map((s) => {
        return intents[s]
      })
    )
    closeModal()
  }

  const onCancel = () => {
    console.log('onCancel')
    closeModal()
  }

  const onSelectNewIntent = (intent: Intent) => {
    appendIntent(intent)
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Node Intents for {id}</ModalHeader>
      <Note>Node intents are used to sync blocks to specific places of applications.</Note>

      {intentMap.map((i) => (
        <IntentMapItem key={`intents_selection_in_modal_${i.service.id}_${i.service.type}`}>
          <IntentSelector
            id="ModalSelector"
            service={i.service.id}
            readOnly={i.service.id === 'mex'}
            type={i.service.type}
            onSelect={onSelectNewIntent}
            defaultIntent={i.intent}
          />
        </IntentMapItem>
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
