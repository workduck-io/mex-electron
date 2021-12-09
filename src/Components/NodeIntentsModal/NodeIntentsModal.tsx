import React from 'react'
import Modal from 'react-modal'
import { Link } from 'react-router-dom'
import create from 'zustand'
import { useLinks } from '../../Editor/Actions/useLinks'
import { Intent } from '../../Editor/Components/SyncBlock'
import IntentSelector from '../../Editor/Components/SyncBlock/intentSelector'
import useIntents from '../../Hooks/useIntents/useIntents'
import { Button } from '../../Styled/Buttons'
import { IntentMapItem } from '../../Styled/Integration'
import { Para } from '../../Styled/Typography'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { Command } from './styled'

export interface NodeIntegrationsModalProps {
  uid: string
}

interface NodeIntentsModalProps {
  open: boolean
  intents: { [id: string]: Intent }
  toggleModal: () => void
  openModal: () => void
  closeModal: () => void
  appendIntent: (intent: Intent) => void
}

export const useNodeIntentsModalStore = create<NodeIntentsModalProps>((set) => ({
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

const NodeIntentsModal = ({ uid }: NodeIntegrationsModalProps) => {
  const { getNodeIntents, updateNodeIntents } = useIntents()
  const intentMap = getNodeIntents(uid)
  const closeModal = useNodeIntentsModalStore((store) => store.closeModal)
  const open = useNodeIntentsModalStore((store) => store.open)
  const intents = useNodeIntentsModalStore((store) => store.intents)
  const appendIntent = useNodeIntentsModalStore((store) => store.appendIntent)
  const { getNodeIdFromUid } = useLinks()

  const onSave = () => {
    // console.log('onSave', intents)
    // Replace intents in intents and specific intent groups
    updateNodeIntents(
      uid,
      Object.keys(intents).map((s) => {
        return intents[s]
      })
    )
    closeModal()
  }

  const onCancel = () => {
    // console.log('onCancel')
    closeModal()
  }

  const onSelectNewIntent = (intent: Intent) => {
    appendIntent(intent)
  }

  const connectedServices = intentMap.filter((i) => i.service.connected)
  const isConnnectedToServices = connectedServices.length !== 0

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Node Intents for {getNodeIdFromUid(uid)}</ModalHeader>
      <Para>
        Add integrations and use them anywhere using <Command>/sync</Command> command.
      </Para>
      {connectedServices.map((i) => (
        <IntentMapItem key={`intents_selection_in_modal_${i.service.id}_${i.service.type}`}>
          <IntentSelector
            id="ModalSelector"
            service={i.service.id}
            readOnly={i.service.id === 'MEX'}
            type={i.service.type}
            onSelect={onSelectNewIntent}
            defaultIntent={i.intent}
          />
        </IntentMapItem>
      ))}

      {!isConnnectedToServices && (
        <Para>
          Go to{' '}
          <Link to="/integrations" href="/integrations">
            Integrations
          </Link>{' '}
          page
        </Para>
      )}

      <ModalControls>
        {isConnnectedToServices && (
          <Button large primary onClick={onSave}>
            Save
          </Button>
        )}
        <Button large onClick={onCancel}>
          Cancel
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default NodeIntentsModal
