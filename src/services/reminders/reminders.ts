// import { add } from 'date-fns'
// // import { ipcRenderer } from 'electron'
// import { IpcAction } from '../../data/IpcAction'
// import { ToastStatus } from '../../electron/Toast'
// import { Reminder } from '../../types/reminders'
import { sub } from 'date-fns'
import { Reminder, ReminderGroup } from '../../types/reminders'

/*
 * Only sets up reminder for the next 24 hours
 */
const BASE_REMINDER_HEIGHT = 80
const BASE_TITLE_HEIGHT = 20
export const BASE_WIDTH = 500
const BASE_PADDING = 12

export const REMINDERS_DIMENSIONS = {
  height: 100,
  width: BASE_WIDTH + BASE_PADDING * 2,
  baseWidth: BASE_WIDTH,
  padding: BASE_PADDING,
  offset: 20
}

export type ReminderStatus = 'active' | 'snooze' | 'seen' | 'missed'

export const getReminderState = (reminder: Reminder): ReminderStatus => {
  const now = new Date()
  const lessOneMin = sub(now, { minutes: 1 })
  const { time, state } = reminder
  if (state.done) {
    return 'seen'
  }
  if (time < lessOneMin.getTime()) {
    return 'missed'
  }
  if (state.snooze) {
    return 'snooze'
  }
  return 'active'
}

export const getReminderDimensions = (reminderGroups: ReminderGroup[]) => {
  let reminderHeight = 0
  reminderGroups.forEach((group) => {
    reminderHeight += group.reminders.length * BASE_REMINDER_HEIGHT + BASE_TITLE_HEIGHT
  })
  return {
    height: reminderHeight + BASE_PADDING * 2,
    width: BASE_WIDTH + BASE_PADDING * 2
  }
}

export const getReminderGroupDimensions = (reminderGroups: ReminderGroup[]) => {
  const remindersHeight = reminderGroups.reduce((p, group) => {
    return group.reminders.length * BASE_REMINDER_HEIGHT + p
  }, 0)
  const reminderTitleHeight = reminderGroups.length * BASE_TITLE_HEIGHT
  return {
    height: reminderTitleHeight + remindersHeight + BASE_PADDING,
    width: BASE_WIDTH + BASE_PADDING
  }
}
