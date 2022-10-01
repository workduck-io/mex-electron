import React, { useEffect } from 'react'

import { AppType } from '@data/constants'

import { IpcAction } from '../../data/IpcAction'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import { ReminderGroup, Reminder, DisplayReminderGroup } from '../../types/reminders'
import { mog } from '../../utils/lib/helper'
import ReminderUI, { ReminderControls } from '../mex/Reminders/Reminder'
import {
  ReminderGroupsWrapper,
  ReminderGroupTitle,
  ReminderGroupWrapper,
  RemindersWrapper,
  ReminderUIGlobal
} from '../mex/Reminders/Reminders.style'

interface ReminderGroupProps {
  reminderGroup: DisplayReminderGroup
  controls: ReminderControls
}

export const ReminderGroupUI = ({ reminderGroup, controls }: ReminderGroupProps) => {
  if (reminderGroup.reminders.length === 0) {
    return null
  }
  return (
    <ReminderGroupWrapper>
      <ReminderGroupTitle>{reminderGroup.label}</ReminderGroupTitle>
      <RemindersWrapper>
        {reminderGroup.reminders.map((reminder) => (
          <ReminderUI isNotification showNodeInfo controls={controls} reminder={reminder} key={reminder.id} />
        ))}
      </RemindersWrapper>
    </ReminderGroupWrapper>
  )
}

interface ReminderGroupsProps {
  reminderGroups: ReminderGroup[]
}

// export interface ReminderGroupsUIState {
//   reminderGroups: ReminderGroup[]
// }

const ReminderGroupsUI = ({ reminderGroups: init }: ReminderGroupsProps) => {
  const [reminderGroups, setReminderGroups] = React.useState(init)

  useEffect(() => {
    setReminderGroups(init)
  }, [init])

  useEffect(() => {
    const rootEl = document.getElementById('root')
    if (rootEl) {
      const resizeObserver = new ResizeObserver(
        // debounce(
        (entries) => {
          // console.log('Body height changed:', entries[0].target.clientHeight)
          appNotifierWindow(IpcAction.RESIZE_REMINDER, AppType.SPOTLIGHT, { height: entries[0].target.clientHeight })
        }
        // , 250)
      )
      resizeObserver.observe(rootEl)
    }
  }, [])

  useEffect(() => {
    const remLeft = reminderGroups.reduce((acc, group) => acc + group.reminders.length, 0)
    if (remLeft === 0) {
      appNotifierWindow(IpcAction.HIDE_REMINDER, AppType.SPOTLIGHT)
    }
  }, [reminderGroups])

  const removeReminderFromGroups = (reminder: Reminder) => {
    const newReminderGroups = reminderGroups.map((group) => {
      if (group.reminders.includes(reminder)) {
        const newReminders = group.reminders.filter((r) => r.id !== reminder.id)
        return { ...group, reminders: newReminders }
      }
      return group
    })
    setReminderGroups(newReminderGroups)
  }

  const onClose = () => {
    appNotifierWindow(IpcAction.HIDE_REMINDER, AppType.SPOTLIGHT)
  }

  const controls: ReminderControls = [
    {
      type: 'open',
      action: (reminder: Reminder) => {
        removeReminderFromGroups(reminder)
        mog('open', { reminder })
        appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, {
          action: { type: 'open' },
          reminder: reminder
        })
      }
    },
    {
      type: 'snooze',
      action: (reminder: Reminder, time) => {
        removeReminderFromGroups(reminder)
        appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, {
          action: { type: 'snooze', value: time },
          reminder: reminder
        })
      }
    },
    {
      type: 'dismiss',
      action: (reminder: Reminder) => {
        removeReminderFromGroups(reminder)
        appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, { action: { type: 'dismiss' }, reminder: reminder })
      }
    }

    // onDismiss: (reminder: Reminder) => {
    //              removeReminderFromGroups(reminder)
    //                appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, { type: 'dismiss', reminder: reminder })
    //            },
    // onOpen: (reminder: Reminder) => {
    //           removeReminderFromGroups(reminder)
    //             appNotifierWindow(IpcAction.ACTION_REMINDER, AppType.MEX, { type: 'open', reminder: reminder })
    //         }
  ]

  return (
    <ReminderGroupsWrapper>
      {reminderGroups.map((reminderGroup) => (
        <ReminderGroupUI controls={controls} reminderGroup={reminderGroup} key={reminderGroup.type} />
      ))}
      <ReminderUIGlobal />
    </ReminderGroupsWrapper>
  )
}
export default ReminderGroupsUI
