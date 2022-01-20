import { client } from '@workduck-io/dwindle'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Modal from 'react-modal'
import create from 'zustand'
import useAnalytics from '../../analytics'
import { ActionType } from '../../analytics/events'
import { useSaveData } from '../../Data/useSaveData'
import { useUpdater } from '../../Data/useUpdater'
import { generateSyncTempId } from '../../Defaults/idPrefixes'
import { SyncBlockTemplate } from '../../Editor/Components/SyncBlock'
import { useSyncStore } from '../../Editor/Store/SyncStore'
import { useAuthStore } from '../../Hooks/useAuth/useAuth'
import { capitalize, getEventNameFromElement } from '../../Lib/strings'
import { integrationURLs } from '../../Requests/routes'
import { Button } from '../../Styled/Buttons'
import { InputBlock, Label, TextAreaBlock } from '../../Styled/Form'
import { LoadingButton } from '../Buttons/LoadingButton'
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

const NewSyncTemplateModal = () => {
  // const openModal = useNewSyncBlockStore((store) => store.openModal)
  const closeModal = useNewSyncTemplateModalStore((store) => store.closeModal)
  const open = useNewSyncTemplateModalStore((store) => store.open)
  const addTemplate = useSyncStore((store) => store.addTemplate)
  const services = useSyncStore((store) => store.services)
  const { updater } = useUpdater()
  const workspaceId = useAuthStore((store) => store.workspaceDetails.id)
  const saveData = useSaveData()
  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm()
  const { trackEvent } = useAnalytics()

  // const theme = useTheme()

  const serviceOptions = services
    .filter((s) => s.id !== 'MEX' && s.enabled && s.connected)
    .map((s) => ({
      label: `${capitalize(s.id)} - ${capitalize(s.type)}`,
      value: { service: s.id, type: s.type },
      icon: s.id
    }))

  const handleCancel = () => {
    closeModal()
  }

  const onSubmit = async ({ intents, command, title, description }) => {
    // console.log({ intents, command, title, description })

    const template: SyncBlockTemplate = {
      id: generateSyncTempId(),
      command,
      title,
      intents: [
        ...intents,
        {
          service: 'MEX',
          type: 'node'
        }
      ],
      description
    }

    trackEvent(getEventNameFromElement('Integrations', ActionType.CREATE, 'Template'), {
      'mex-template': template
    })

    const intentMap = {}
    template.intents.forEach((i) => {
      intentMap[i.service.toUpperCase()] = i.type
    })

    const reqData = {
      intentMap,
      templateId: template.id,
      workspaceId,
      command: template.command,
      title: template.title,
      description: template.description
    }

    await client.post(integrationURLs.createTemplate, reqData).then(() => {
      addTemplate(template)
      saveData()
      updater()

      closeModal()
    })
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>New Sync Template</ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="command">Command</Label>
        <InputBlock autoFocus placeholder="Ex. notify" {...register('command')} />

        <Label htmlFor="title">Title</Label>
        <InputBlock placeholder="Ex. Notify Team Members" {...register('title')} />

        <Label htmlFor="description">Description</Label>
        <TextAreaBlock
          placeholder="Ex. Notify team members about recent changes in spec"
          {...register('description')}
        />

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
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton loading={isSubmitting} buttonProps={{ type: 'submit', primary: true, large: true }}>
            Submit
          </LoadingButton>
        </ModalControls>
      </form>
    </Modal>
  )
}

export default NewSyncTemplateModal
