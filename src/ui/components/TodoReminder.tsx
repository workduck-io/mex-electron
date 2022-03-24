import React from 'react'
import { useCreateReminderModal } from '../../components/mex/Reminders/CreateReminderModal'
import { TodoActionButton, TodoActionWrapper } from './Todo.style'
import Tippy from '@tippyjs/react'
import { useReminders } from '../../hooks/useReminders'
import { getReminderState } from '../../services/reminders/reminders'
import { reminderStateIcons } from '../../components/mex/Reminders/Reminder'
import addCircleLine from '@iconify/icons-ri/add-circle-line'
import { MexIcon } from '../../style/Layouts'
import { useLayoutStore } from '../../store/useLayoutStore'
import { getRelativeTime } from '../../utils/time'
import { NodeEditorContent } from '../../types/Types'

interface TodoReminderProps {
  oid: string
  todoid: string
  nodeid: string
  content: NodeEditorContent
}

const TodoReminder = ({ oid, todoid, nodeid, content }: TodoReminderProps) => {
  const openModal = useCreateReminderModal((state) => state.openModal)
  const { getBlockReminder } = useReminders()
  const reminder = getBlockReminder(todoid)
  const reminderState = reminder ? getReminderState(reminder) : null
  const setInfobarMode = useLayoutStore((state) => state.setInfobarMode)

  const onClick = (e) => {
    e.preventDefault()
    const infobar = useLayoutStore.getState().infobar
    if (reminderState === null) {
      openModal({
        todoid: todoid,
        nodeid: nodeid,
        blockContent: content
      })
    } else {
      if (infobar.mode !== 'reminders') {
        setInfobarMode('reminders')
      }
    }
  }

  return (
    <TodoActionWrapper id={`TodoReminderPrompt_${oid}_${todoid}`}>
      <Tippy
        delay={100}
        interactiveDebounce={100}
        placement="bottom"
        appendTo={() => document.body}
        theme="mex"
        content={
          reminderState
            ? `Reminder ${reminderState[0].toUpperCase()}${reminderState.slice(1)} ${
                reminder.time ? getRelativeTime(new Date(reminder.time)) : ''
              }`
            : 'Add Reminder'
        }
      >
        <TodoActionButton>
          <MexIcon
            onClick={onClick}
            icon={reminderState ? reminderStateIcons[reminderState] : addCircleLine}
            fontSize={20}
            cursor="pointer"
          />
        </TodoActionButton>
      </Tippy>
    </TodoActionWrapper>
  )
}

export default TodoReminder
