import React from 'react'
import Modal from 'react-modal'
import create from 'zustand'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { sampleServices } from './sampleServices'
import ServiceSelector from './ServiceSelector'

interface NewSyncTemplateModalState {
  open: boolean
  focus: boolean
  openModal: (id?: string) => void
  setFocus: (focus: boolean) => void
  closeModal: () => void
}

export const useNewSyncTemplateModalStore = create<NewSyncTemplateModalState>((set) => ({
  open: false,
  focus: true,
  openModal: () => {
    set({
      open: true
    })
  },
  closeModal: () => {
    set({
      open: false
    })
  },
  setFocus: (focus) => set({ focus })
}))

const NewSyncBlockModal = () => {
  // const { getMockDelete, execDelete } = useDelete()
  // const { push } = useNavigation()
  // const shortcuts = useHelpStore((store) => store.shortcuts)

  // const openModal = useNewSyncBlockStore((store) => store.openModal)
  const closeModal = useNewSyncTemplateModalStore((store) => store.closeModal)
  const open = useNewSyncTemplateModalStore((store) => store.open)

  // const theme = useTheme()

  const serviceOptions = sampleServices.map((s) => ({
    label: s.title,
    value: s.name
  }))

  const handleParentBlockChange = (newValue: string) => {
    if (newValue) {
      console.log({ newValue })
    }
  }

  const handleCancel = () => {
    closeModal()
  }

  const handleSubmit = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>New Sync Template</ModalHeader>

      <WrappedNodeSelect
        autoFocus
        // menuOpen
        defaultValue={useEditorStore.getState().node.id}
        handleSelectItem={handleParentBlockChange}
      />

      <p>Services to sync</p>
      {/* Connect more services via integrations. */}
      <ServiceSelector options={serviceOptions} />

      <ModalControls>
        <Button size="large" primary onClick={handleSubmit}>
          Submit
        </Button>
        <Button size="large" onClick={handleCancel}>
          Cancel
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default NewSyncBlockModal
