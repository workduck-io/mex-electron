import React from 'react'
import tinykeys from 'tinykeys'
import { useLinks } from '../../../hooks/useLinks'
import { useReminderStore } from '../../../hooks/useReminders'
import { useSaveData } from '../../../hooks/useSaveData'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useEditorStore } from '../../../store/useEditorStore'
import { useHelpStore } from '../../../store/useHelpStore'
import { useRecentsStore } from '../../../store/useRecentsStore'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import Modal from 'react-modal'
import { Button } from '../../../style/Buttons'
import create from 'zustand'
import { Controller, useForm } from 'react-hook-form'
import { getEventNameFromElement } from '../../../utils/lib/strings'
import useAnalytics from '../../../services/analytics'
import { ActionType } from '../../../services/analytics/events'
import { Reminder, REMINDER_PREFIX } from '../../../types/reminders'
import { nanoid } from 'nanoid'
import { mog } from '../../../utils/lib/helper'
import { InputBlock, Label, TextAreaBlock } from '../../../style/Form'
import { LoadingButton } from '../Buttons/LoadingButton'

interface CreateReminderModalState {
  open: boolean
  focus: boolean
  nodeid: string | undefined

  toggleModal: () => void
  openModal: (nodeid?: string) => void
  setFocus: (focus: boolean) => void
  closeModal: () => void
  setNodeid: (nodeid: string | undefined) => void
}

export const useCreateReminderModal = create<CreateReminderModalState>((set) => ({
  open: false,
  focus: false,
  nodeid: undefined,

  openModal: (nodeid) => {
    set({
      open: true,
      focus: true,
      nodeid
    })
  },

  toggleModal: () => set((state) => ({ open: !state.open })),

  setFocus: (focus: boolean) => {
    set({
      focus
    })
  },

  closeModal: () => {
    set({
      open: false,
      focus: false,
      nodeid: undefined
    })
  },
  setNodeid: (nodeid: string | undefined) => {
    set({
      nodeid
    })
  }
}))

const CreateReminderModal = () => {
  const modalOpen = useCreateReminderModal((state) => state.open)
  const closeModal = useCreateReminderModal((state) => state.closeModal)
  const remNodeid = useCreateReminderModal((state) => state.nodeid)
  const { saveData } = useSaveData()
  const [nodepath, setNodepath] = React.useState('')

  const { getNodeidFromPath } = useLinks()

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm()

  const handleFromChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    if (newValue) {
      // setFrom(newValue)
    }
  }
  const { trackEvent } = useAnalytics()

  const onSubmit = async ({ title, description, time, priority }) => {
    // console.log({ intents, command, title, description })
    const reminder: Reminder = {
      id: `${REMINDER_PREFIX}${nanoid()}`,
      title,
      description,
      nodeid: remNodeid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      time,
      // frequency?: ReminderFrequency,
      priority
      // blockid?: string,
    }

    trackEvent(getEventNameFromElement('Reminders', ActionType.CREATE, 'Reminder'), {
      'mex-template': reminder
    })

    mog('Creating Reminder', {
      reminder
    })
  }
  // const { from, to, open, mockRefactor } = renameState

  // useEffect(() => {
  //   if (to && from && !isReserved(from) && !isReserved(from)) {
  //     // mog('To, from in rename', { to, from })
  //     setMockRefactored(getMockRefactor(from, to))
  //   }
  // }, [to, from, q])

  const handleRefactor = () => {
    // if (to && from) {
    //   // mog('To, from in rename exec', { to, from })
    //   const res = execRefactor(from, to)

    //   saveData()
    //   const path = useEditorStore.getState().node.id
    //   const nodeid = useEditorStore.getState().node.nodeid
    //   if (doesLinkRemain(path, res)) {
    //     push(nodeid, { savePrev: false })
    //   } else if (res.length > 0) {
    //     const nodeid = getNodeidFromPath(res[0].to)
    //     push(nodeid, { savePrev: false })
    //   }
    // }

    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }
  // mog('RenameComponent', { mockRefactored, to, from, ilinks: useDataStore.getState().ilinks })

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={modalOpen}>
      <ModalHeader>Rename</ModalHeader>

      <WrappedNodeSelect
        placeholder="Reminder for node"
        defaultValue={useEditorStore.getState().node.id ?? nodepath}
        disallowReserved
        highlightWhenSelected
        iconHighlight={nodepath !== undefined}
        handleSelectItem={handleFromChange}
      />

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

        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton loading={isSubmitting} buttonProps={{ type: 'submit', primary: true, large: true }}>
            Submit
          </LoadingButton>
        </ModalControls>
      </form>
      <ModalControls>
        <Button primary large onClick={handleRefactor}>
          Apply Rename
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default CreateReminderModal
