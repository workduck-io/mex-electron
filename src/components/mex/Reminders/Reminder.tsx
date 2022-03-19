import { Icon } from '@iconify/react'
import timerLine from '@iconify/icons-ri/timer-line'
import React from 'react'
import { Description, Title } from '../../../style/Typography'
import { Reminder } from '../../../types/reminders'
import { mog } from '../../../utils/lib/helper'
import { getRelativeDate } from '../../../utils/time'
import { RelativeTime } from '../RelativeTime'
import {
  ReminderControlsWrapper,
  ReminderExact,
  ReminderGroupsWrapper,
  ReminderRelative,
  ReminderStateTag,
  ReminderStyled,
  ReminderTime,
  SnoozeControls
} from './Reminders.style'
import { Button } from '../../../style/Buttons'
import { useReminders } from '../../../hooks/useReminders'
import { add, sub } from 'date-fns'

export interface ReminderControls {
  onSnooze: (reminder: Reminder, time: number) => void
  onDismiss: (reminder: Reminder) => void
  onOpen: (reminder: Reminder) => void
}

interface Props {
  reminder: Reminder
  showControls?: boolean
  controls?: ReminderControls
}

interface ReminderControlProps {
  reminder: Reminder
  controls: ReminderControls
}

const DefaultSnoozeTimes = () => {
  const now = new Date()
  const fifteenMinutes = add(now, { minutes: 15 })
  const oneHour = add(now, { hours: 1 })
  const oneDay = add(now, { days: 1 })

  return [
    {
      time: fifteenMinutes,
      label: '15 min'
    },
    {
      time: oneHour,
      label: '1 hour'
    },
    {
      time: oneDay,
      label: '1 day'
    }
  ]
}

const ReminderControlsUI = ({ controls, reminder }: ReminderControlProps) => {
  // const { snooze, dismiss, open } = useReminders()
  const [snoozeControls, setSnoozeControls] = React.useState(false)
  if (!controls) return null
  const { onSnooze, onDismiss, onOpen } = controls

  return (
    <>
      {snoozeControls && (
        <SnoozeControls>
          Snooze For:
          {DefaultSnoozeTimes().map(({ time, label }) => (
            <Button
              key={time.toString()}
              onClick={() => {
                onSnooze(reminder, time.getTime())
                setSnoozeControls(false)
              }}
            >
              {label}
            </Button>
          ))}
        </SnoozeControls>
      )}

      <ReminderControlsWrapper>
        <Button
          onClick={() => {
            setSnoozeControls(!snoozeControls)
            // onSnooze(reminder)
          }}
        >
          Snooze
        </Button>
        <Button
          onClick={() => {
            onDismiss(reminder)
          }}
        >
          Dismiss
        </Button>
        <Button
          onClick={() => {
            onOpen(reminder)
          }}
        >
          Open
        </Button>
      </ReminderControlsWrapper>
    </>
  )
}

const stateIcons = {
  active: timerLine,
  snooze: timerLine,
  missed: 'ri-close-line',
  done: 'ri-check-line'
}

const getReminderState = (reminder: Reminder): 'active' | 'snooze' | 'done' | 'missed' => {
  const now = new Date()
  const lessOneMin = sub(now, { minutes: 1 })
  const { time, state } = reminder
  if (state.done) {
    return 'done'
  }
  if (time < lessOneMin.getTime()) {
    return 'missed'
  }
  if (state.snooze) {
    return 'snooze'
  }
  return 'active'
}

const ReminderUI = ({ reminder, showControls, controls }: Props) => {
  // mog('reminder', { reminder })
  const reminderState = getReminderState(reminder)
  return (
    <ReminderStyled key={`ReultForSearch_${reminder.id}`} showControls={showControls}>
      <ReminderTime>
        <ReminderRelative>
          <ReminderStateTag state={reminderState}>
            <Icon icon={stateIcons[reminderState]} />
            {reminderState}
          </ReminderStateTag>
          {!controls && (
            <RelativeTime
              tippy
              dateNum={reminder.time}
              refreshMs={1000 * 30}
              tippyProps={{ placement: 'right', theme: 'mex-bright' }}
            />
          )}
        </ReminderRelative>
        <ReminderExact>{getRelativeDate(new Date(reminder.time))}</ReminderExact>
      </ReminderTime>
      <Title>{reminder.title}</Title>
      <Description>{reminder.description}</Description>
      <ReminderControlsUI controls={controls} reminder={reminder} />
    </ReminderStyled>
  )
}

export default ReminderUI
