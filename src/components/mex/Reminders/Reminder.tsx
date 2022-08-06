import closeCircleLine from '@iconify/icons-ri/close-circle-line'
import { Icon } from '@iconify/react'
import timerLine from '@iconify/icons-ri/timer-line'
import React from 'react'
import { Description, Title } from '../../../style/Typography'
import { DisplayReminder, Reminder } from '../../../types/reminders'
import { mog } from '../../../utils/lib/helper'
import arrowDropRightLine from '@iconify/icons-ri/arrow-drop-right-line'
import arrowDropUpLine from '@iconify/icons-ri/arrow-drop-up-line'
import { getNextReminderTime, getRelativeDate } from '../../../utils/time'
import { RelativeTime } from '../RelativeTime'
import {
  ReminderButtonControlsWrapper,
  ReminderControlsWrapper,
  ReminderExact,
  ReminderGroupsWrapper,
  ReminderRelative,
  ReminderStateTag,
  ReminderStyled,
  ReminderTime,
  SnoozeControls
} from './Reminders.style'
import { useReminders } from '../../../hooks/useReminders'
import { sub } from 'date-fns'
import { add } from 'date-fns/fp'
import { getReminderState, ReminderStatus } from '../../../services/reminders/reminders'
import fileList2Line from '@iconify/icons-ri/file-list-2-line'
import { TodoType } from '../../../editor/Components/Todo/types'
import NotificationTodo from '../../toast/NotificationTodo'
import { getNameFromPath } from '../Sidebar/treeUtils'
import { Button } from '@workduck-io/mex-components'

export interface ReminderControl {
  type: 'dismiss' | 'open' | 'delete' | 'unarchive'
  action: (reminder: Reminder) => void
}

export interface SnoozeControl {
  type: 'snooze'
  action: (reminder: Reminder, time: number) => void
}

export type ReminderControls = Array<ReminderControl | SnoozeControl>

interface Props {
  reminder: DisplayReminder
  isNotification?: boolean
  controls?: Array<ReminderControl | SnoozeControl>
  showNodeInfo?: boolean
  oid?: string
}

interface ReminderControlProps {
  reminder: DisplayReminder
  controls: Array<ReminderControl | SnoozeControl>
  snoozeControls: boolean
  setSnoozeControls: React.Dispatch<React.SetStateAction<boolean>>
  isNotification?: boolean
}

const DefaultSnoozeTimes = () => {
  const fifteenMinutes = add({ minutes: 15 })
  const oneHour = add({ hours: 1 })
  const oneDay = add({ days: 1 })

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

const ReminderControlsUI = ({
  controls,
  isNotification,
  reminder,
  snoozeControls,
  setSnoozeControls
}: ReminderControlProps) => {
  // const { snooze, dismiss, open } = useReminders()
  if (!controls) return null
  const onSnooze = controls.find((c) => c.type === 'snooze')?.action
  // const { onSnooze, onDismiss, onOpen } = controls

  return (
    <ReminderControlsWrapper>
      {onSnooze && (
        <SnoozeControls showControls={snoozeControls}>
          For:
          {DefaultSnoozeTimes().map(({ time, label }) => (
            <Button
              key={`SnoozeTimes${label}`}
              onClick={() => {
                onSnooze(reminder, time(Date.now()).getTime())
                setSnoozeControls(false)
              }}
            >
              {label}
            </Button>
          ))}
          <Button
            onClick={() => {
              setSnoozeControls(false)
            }}
          >
            <Icon height={20} icon={closeCircleLine} />
          </Button>
        </SnoozeControls>
      )}
      <ReminderButtonControlsWrapper>
        {controls.map((control) => {
          if (control.type === 'snooze') {
            return (
              <Button
                key={control.type}
                transparent
                primary={snoozeControls}
                onClick={() => {
                  setSnoozeControls((prevState: boolean) => !prevState)
                }}
              >
                Snooze
              </Button>
            )
          }
          return (
            <Button
              key={control.type}
              transparent={control.type !== 'open'}
              onClick={() => {
                control.action(reminder)
              }}
            >
              {control.type.charAt(0).toUpperCase() + control.type.slice(1)}
              {control.type === 'open' && reminder.path && (
                <>
                  <Icon height={14} icon={fileList2Line} /> {getNameFromPath(reminder.path)}
                </>
              )}
            </Button>
          )
        })}
      </ReminderButtonControlsWrapper>
    </ReminderControlsWrapper>
  )
}

export const reminderStateIcons: Record<ReminderStatus, string> = {
  active: 'ri-chat-4-line',
  snooze: 'ri-chat-forward-line',
  missed: 'ri-chat-delete-line',
  seen: 'ri-check-double-line'
}

const ReminderUI = ({ reminder, isNotification, showNodeInfo, controls, oid }: Props) => {
  // mog('ReminderUI', { reminder, isNotification, showNodeInfo })
  const [snoozeControls, setSnoozeControls] = React.useState(false)
  // mog('reminder', { reminder })
  const reminderState = getReminderState(reminder)

  return (
    <ReminderStyled
      id={`StyledReminderForReminders_${reminder.id}_${oid}`}
      key={`StyledReminderForReminders_${reminder.id}_${oid}`}
      isNotification={isNotification}
      showControls={snoozeControls}
    >
      <ReminderTime>
        <ReminderRelative>
          <ReminderStateTag state={reminderState}>
            <Icon icon={reminderStateIcons[reminderState]} />
            {reminderState}
          </ReminderStateTag>
          {!isNotification && (
            <RelativeTime
              tippy
              dateNum={reminder.time}
              refreshMs={1000 * 30}
              tippyProps={{ placement: 'right', theme: 'mex-bright' }}
            />
          )}
        </ReminderRelative>
        {showNodeInfo && reminder.path && (
          <ReminderStateTag>
            <Icon icon={fileList2Line} />
            {reminder.path}
          </ReminderStateTag>
        )}
        {reminder.todoid && (
          <ReminderStateTag>
            <Icon icon="ri-task-line" />
            Task
          </ReminderStateTag>
        )}
        <ReminderExact>{getRelativeDate(new Date(reminder.time))}</ReminderExact>
      </ReminderTime>
      <Title>{reminder.title}</Title>
      {reminder.description && <Description>{reminder.description}</Description>}
      {reminder.todo && (
        <NotificationTodo
          oid="ReminderTodo"
          isNotification={isNotification}
          reminder={reminder}
          todo={reminder.todo as TodoType}
          dismissNotification={() => {
            console.log('dismiss notification')
          }}
        />
      )}
      <ReminderControlsUI
        isNotification={isNotification}
        snoozeControls={snoozeControls}
        setSnoozeControls={setSnoozeControls}
        controls={controls}
        reminder={reminder}
      />
    </ReminderStyled>
  )
}

export default ReminderUI
