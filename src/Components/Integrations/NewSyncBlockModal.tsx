import { nanoid } from 'nanoid'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Modal from 'react-modal'
import create from 'zustand'
import { SyncBlockTemplate } from '../../Editor/Components/SyncBlock'
import { useSyncStore } from '../../Editor/Store/SyncStore'
import { capitalize } from '../../Lib/strings'
import { Button } from '../../Styled/Buttons'
import { InputBlock, Label, TextAreaBlock } from '../../Styled/Form'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import ServiceSelector from './ServiceSelector'

interface NewSyncTemplateModalState {
  open: boolean
  focus: boolean

  openModal: (id?: string) => void
  setFocus: (focus: boolean) => void
  closeModal: () => void
}

export const useNewSyncTemplateModalStore = create<NewSyncTemplateModalState>((set) => ({
  open: true,
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
  const services = useSyncStore((store) => store.services)

  const { control, register, getValues } = useForm()

  // const theme = useTheme()

  const serviceOptions = services.map((s) => ({
    label: `${capitalize(s.id)} - ${capitalize(s.type)}`,
    value: { service: s.id, type: s.type },
    icon: s.id
  }))

  const handleCancel = () => {
    closeModal()
  }

  const handleSubmit = () => {
    const { intents, command, title, description } = getValues()
    // console.log({ intents, command, title, description })

    const template: SyncBlockTemplate = {
      id: `SYNCTEMP_${nanoid()}`,
      command,
      title,
      intents,
      description
    }
    addTemplate(template)
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>New Sync Template</ModalHeader>

      <Label htmlFor="command">Command</Label>
      <InputBlock autoFocus placeholder="Ex. notify" {...register('command')} />

      <Label htmlFor="title">Title</Label>
      <InputBlock placeholder="Ex. Notify Team Members" {...register('title')} />

      <Label htmlFor="description">Description</Label>
      <TextAreaBlock placeholder="Ex. Notify team members about recent changes in spec" {...register('description')} />

      <Label htmlFor="intents">Services to sync</Label>
      <Controller
        name="intents"
        control={control}
        render={({ field: { onChange, /* value, */ ref } }) => (
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
