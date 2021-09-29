import React from 'react'
import Modal from 'react-modal'
import { useSyncStore } from '../../Editor/Store/SyncStore'
import create from 'zustand'
import { useEditorStore } from '../../Editor/Store/EditorStore'
import { Button } from '../../Styled/Buttons'
import { WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { sampleServices } from './sampleServices'
import ServiceSelector from './ServiceSelector'
import { IntentTemplate, SyncBlockTemplate } from '../../Editor/Components/SyncBlock'
import { Controller, useForm } from 'react-hook-form'
import { Input } from '../../Styled/Form'
import { capitalize } from '../../Lib/strings'

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
  // const openModal = useNewSyncBlockStore((store) => store.openModal)
  const closeModal = useNewSyncTemplateModalStore((store) => store.closeModal)
  const open = useNewSyncTemplateModalStore((store) => store.open)
  const addTemplate = useSyncStore((store) => store.addTemplate)

  const { control, register, getValues } = useForm()

  // const theme = useTheme()

  const serviceOptions = sampleServices.map((s) => ({
    label: `${capitalize(s.name)} - ${capitalize(s.type)}`,
    value: { service: s.name, type: s.type },
    icon: s.name
  }))

  const handleCancel = () => {
    closeModal()
  }

  const handleSubmit = () => {
    const vals = getValues()
    console.log({ vals })

    // const template: SyncBlockTemplate = {
    //   id: '',
    //   title: '',
    //   intents: [],
    // }
    // addTemplate(template)
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>New Sync Template</ModalHeader>

      <Input {...register('id')} />

      <Input {...register('title')} />

      <Controller
        name="parentBlock"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <WrappedNodeSelect
            highlightWhenSelected
            iconHighlight={value !== undefined}
            autoFocus
            inputRef={ref}
            handleSelectItem={onChange}
            defaultValue={useEditorStore.getState().node.id}
          />
        )}
      />

      {/* <WrappedNodeSelect
        autoFocus
        // menuOpen
        defaultValue={useEditorStore.getState().node.id}
        handleSelectItem={handleParentBlockChange}
      /> */}

      <p>Services to sync</p>
      {/* Connect more services via integrations. */}
      {/* <ServiceSelector label="Select services" onChange={handleServiceChange} options={serviceOptions} /> */}

      <Controller
        name="intents"
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <ServiceSelector
            inputRef={ref}
            label="Select Services"
            onChange={(val) => onChange(val.map((c) => c.value))}
            options={serviceOptions}
          />
        )}
      />

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
