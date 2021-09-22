import React from 'react'
import Modal from 'react-modal'
import { useTheme } from 'styled-components'
import create from 'zustand'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { useHelpStore } from '../Help/HelpModal'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { sampleServices } from './sampleServices'
import ServiceSelector from './ServiceSelector'

interface NewBlockModalState {
  open: boolean
  focus: boolean
  openModal: (id?: string) => void
  setFocus: (focus: boolean) => void
  closeModal: () => void
}

export const useNewSyncBlockStore = create<NewBlockModalState>((set) => ({
  open: false,
  focus: true,
  openModal: () => {
    set({
      open: true,
    })
  },
  closeModal: () => {
    set({
      open: false,
    })
  },
  setFocus: (focus) => set({ focus }),
}))

const NewSyncBlockModal = () => {
  // const { getMockDelete, execDelete } = useDelete()
  // const { push } = useNavigation()
  // const shortcuts = useHelpStore((store) => store.shortcuts)

  // const openModal = useNewSyncBlockStore((store) => store.openModal)
  const closeModal = useNewSyncBlockStore((store) => store.closeModal)
  const open = useNewSyncBlockStore((store) => store.open)

  // const theme = useTheme()

  const serviceOptions = sampleServices.map((s) => ({
    label: s.title,
    value: s.name,
  }))

  const handleParentBlockChange = (newValue: string) => {
    if (newValue) {
      console.log({ newValue })
    }
  }

  const handleCancel = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>New SyncBlock Type</ModalHeader>

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
        <Button size="large" primary onClick={() => console.log('Submit')}>
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
