import { startOfToday } from 'date-fns'
import { nanoid } from 'nanoid'
import React, { useEffect } from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useForm } from 'react-hook-form'
import Modal from 'react-modal'
import create from 'zustand'
import { useEditorBuffer } from '../../../hooks/useEditorBuffer'
import { useLinks } from '../../../hooks/useLinks'
import { useReminders } from '../../../hooks/useReminders'
import useAnalytics from '../../../services/analytics'
import { ActionType } from '../../../services/analytics/events'
import { useEditorStore } from '../../../store/useEditorStore'
import { Button } from '../../../style/Buttons'
import { DatePickerStyles, InputBlock, Label, TextAreaBlock } from '../../../style/Form'
import { Reminder, REMINDER_PREFIX } from '../../../types/reminders'
import { mog } from '../../../utils/lib/helper'
import { getEventNameFromElement } from '../../../utils/lib/strings'
import { getNextReminderTime, getRelativeDate } from '../../../utils/time'
import { LoadingButton } from '../Buttons/LoadingButton'
import { QuickLink, WrappedNodeSelect } from '../NodeSelect/NodeSelect'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { SelectedDate } from './Reminders.style'

interface ModalValue {
  time?: number
  nodeid?: string
  blockid?: string
  blockContent?: string
}

interface CreateReminderModalState {
  open: boolean
  focus: boolean

  modalValue: ModalValue
  toggleModal: () => void
  openModal: (modalValue?: ModalValue) => void
  setFocus: (focus: boolean) => void
  closeModal: () => void
  setModalValue: (modalValue: ModalValue) => void
  setTime: (time: number) => void
  setNodeId: (nodeid: string) => void
}

export const useCreateReminderModal = create<CreateReminderModalState>((set) => ({
  open: false,
  focus: false,
  modalValue: {
    blockId: undefined,
    blockContent: undefined,
    nodeid: undefined,
    time: undefined
  },

  toggleModal: () => {
    set((state) => ({ open: !state.open }))
  },
  openModal: (modalValue) => {
    if (modalValue) {
      set((state) => ({
        ...state,
        modalValue: modalValue,
        open: true
      }))
    } else {
      set((state) => ({
        ...state,
        modalValue: {
          blockId: undefined,
          blockContent: undefined,
          nodeid: undefined,
          time: undefined
        },
        open: true
      }))
    }
  },
  setFocus: (focus) => {
    set({ focus })
  },
  closeModal: () => {
    set({
      open: false,
      modalValue: {
        time: undefined,
        blockContent: undefined,
        blockid: undefined,
        nodeid: undefined
      }
    })
  },
  setNodeId: (nodeid) => {
    set((state) => ({
      modalValue: { ...state.modalValue, nodeid }
    }))
  },
  setTime: (time) => {
    set((state) => ({
      modalValue: { ...state.modalValue, time }
    }))
  },
  setModalValue: (modalValue) => {
    set({ modalValue })
  }
}))

const CreateReminderModal = () => {
  const modalOpen = useCreateReminderModal((state) => state.open)
  const closeModal = useCreateReminderModal((state) => state.closeModal)
  const modalValue = useCreateReminderModal((state) => state.modalValue)
  const setTime = useCreateReminderModal((state) => state.setTime)
  const setNodeId = useCreateReminderModal((state) => state.setNodeId)
  const node = useEditorStore((state) => state.node)
  const { saveAndClearBuffer } = useEditorBuffer()
  const { addReminder } = useReminders()

  const { getNodeidFromPath } = useLinks()

  const {
    // control,
    reset,
    register,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm()

  useEffect(() => {
    setTime(getNextReminderTime().getTime())
  }, [node, modalOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleNodeChange = (quickLink: QuickLink) => {
    const newValue = quickLink.value
    if (newValue) {
      mog('newValue', { newValue, quickLink })
      setNodeId(getNodeidFromPath(newValue))
    }
  }
  const { trackEvent } = useAnalytics()

  const onSubmit = async ({ title, description }) => {
    // console.log({ intents, command, title, description })
    const { time, nodeid, blockid, blockContent } = modalValue

    const reminder: Reminder = {
      id: `${REMINDER_PREFIX}${nanoid()}`,
      title,
      description: blockContent || description,
      nodeid,
      time,
      state: {
        snooze: false,
        done: false
      },
      blockid,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    trackEvent(getEventNameFromElement('Reminders', ActionType.CREATE, 'Reminder'), {
      'mex-template': reminder
    })

    mog('Creating Reminder', {
      reminder
    })
    addReminder(reminder)
    saveAndClearBuffer()
    reset()
    closeModal()
  }

  const handleCancel = () => {
    closeModal()
  }

  // mog('CreateReminderModal', {
  //   modalOpen,
  //   modalValue
  // })

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={handleCancel} isOpen={modalOpen}>
      <ModalHeader>Reminder</ModalHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="title">Title</Label>
        <InputBlock autoFocus placeholder="Ex. Send email to team" {...register('title')} />

        <Label htmlFor="description">Description {modalValue.blockContent !== undefined && '(Filled from task)'}</Label>
        <TextAreaBlock
          disabled={modalValue.blockContent !== undefined}
          defaultValue={modalValue.blockContent}
          placeholder="Ex. Remember to share new developments"
          {...register('description')}
        />

        <Label htmlFor="node">NodeId</Label>
        <WrappedNodeSelect
          placeholder="Reminder for node"
          defaultValue={useEditorStore.getState().node.id ?? ''}
          disallowReserved
          highlightWhenSelected
          iconHighlight={modalValue.nodeid !== undefined}
          handleSelectItem={handleNodeChange}
        />

        <Label htmlFor="time">Time</Label>
        <DatePickerStyles>
          <ReactDatePicker
            selected={new Date(modalValue.time ?? getNextReminderTime())}
            showTimeSelect
            timeFormat="p"
            timeIntervals={15}
            filterDate={(date) => {
              const todayStart = startOfToday()
              return date.getTime() >= todayStart.getTime()
            }}
            filterTime={(date) => {
              const now = Date.now()
              return date.getTime() >= now
            }}
            onChange={(date) => {
              console.log(date)
              setTime(date.getTime())
            }}
            inline
          />
          {modalValue.time && (
            <SelectedDate>
              <i>Remind :</i>
              <span>{getRelativeDate(new Date(modalValue.time))}</span>
            </SelectedDate>
          )}
        </DatePickerStyles>

        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton loading={isSubmitting} buttonProps={{ type: 'submit', primary: true, large: true }}>
            Save Reminder
          </LoadingButton>
        </ModalControls>
      </form>
    </Modal>
  )
}

export default CreateReminderModal
