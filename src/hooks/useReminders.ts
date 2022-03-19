import { add, startOfTomorrow, sub } from 'date-fns'
import { ipcRenderer } from 'electron'
import create from 'zustand'
import { IpcAction } from '../data/IpcAction'
import { appNotifierWindow } from '../electron/utils/notifiers'
import { uniqBy } from 'lodash'
// import { ToastStatus } from '../electron/Toast'
import { NodeReminderGroup, Reminder, ReminderActions, ReminderGroup, ReminderState } from '../types/reminders'
import { ToastStatus } from '../types/toast'
import { mog } from '../utils/lib/helper'
import { isInSameMinute } from '../utils/time'
import { SearchFilter } from './useFilters'
import { AppType } from './useInitialize'
import { useEffect } from 'react'

interface ReminderStoreState {
  reminders: Reminder[]
  setReminders: (reminders: Reminder[]) => void
  addReminder(reminder: Reminder): void
  deleteReminder(id: string): void
  updateReminder(newReminder: Reminder): void
  updateReminderState: (id: string, rstate: ReminderState) => void
  clearReminders(): void

  // To store the currently aremd ie:"timeout set" reminders
  armedReminders: Reminder[]
  setArmedReminders: (reminders: Reminder[]) => void
  addArmReminder: (reminder: Reminder) => void
  clearArmedReminders: () => void

  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
}

export const useReminderStore = create<ReminderStoreState>((set) => ({
  reminders: [],
  setReminders: (reminders: Reminder[]) => set({ reminders }),
  addReminder: (reminder: Reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
  deleteReminder: (id: string) =>
    set((state) => ({
      reminders: state.reminders.filter((reminder) => reminder.id !== id)
    })),
  updateReminder: (newReminder: Reminder) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === newReminder.id ? { ...reminder, ...newReminder } : reminder
      )
    })),
  updateReminderState: (id: string, rstate: ReminderState) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) => (reminder.id === id ? { ...reminder, state: rstate } : reminder))
    })),
  clearReminders: () => set({ reminders: [] }),

  armedReminders: [],
  setArmedReminders: (reminders: Reminder[]) => set({ armedReminders: reminders }),
  addArmReminder: (reminder: Reminder) => set((state) => ({ armedReminders: [...state.armedReminders, reminder] })),
  clearArmedReminders: () => set({ armedReminders: [] }),

  modalOpen: false,
  setModalOpen: (modalOpen: boolean) => set({ modalOpen })
}))

export const useReminders = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const setReminders = useReminderStore((state) => state.setReminders)
  const addReminder = useReminderStore((state) => state.addReminder)
  const deleteReminder = useReminderStore((state) => state.deleteReminder)
  const updateReminder = useReminderStore((state) => state.updateReminder)
  const clearReminders = useReminderStore((state) => state.clearReminders)

  // const setArmedReminders = useReminderStore((state) => state.setArmedReminders)
  const addArmReminder = useReminderStore((state) => state.addArmReminder)
  const clearArmedReminders = useReminderStore((state) => state.clearArmedReminders)

  const dismissReminder = (reminder: Reminder) => {
    const newReminder: Reminder = {
      ...reminder,
      state: {
        ...reminder.state,
        done: true
      }
    }
    updateReminder(newReminder)
  }

  const snoozeReminder = (reminder: Reminder, time: number) => {
    const newReminder = {
      ...reminder,
      time,
      state: {
        ...reminder.state,
        snooze: true
      }
    }
    updateReminder(newReminder)
  }

  const getTodayReminders = (filter?: SearchFilter<Reminder>) => {
    const filteredReminders = filter ? getFilteredReminders(filter) : reminders
    filteredReminders.filter(today)
  }

  const getFilteredReminders = (filter: SearchFilter<Reminder>) => {
    return reminders.filter((reminder) => {
      return filter.filter(reminder)
    })
  }

  const past = (reminder: Reminder) => {
    const today = new Date()
    const reminderDate = new Date(reminder.time)
    return today.getTime() > reminderDate.getTime()
  }

  const today = (reminder: Reminder) => {
    const now = new Date()
    const tomorrow = startOfTomorrow()
    return now.getTime() <= reminder.time && tomorrow.getTime() >= reminder.time
  }

  const upcoming = (reminder: Reminder) => {
    const today = new Date()
    return today.getTime() <= reminder.time
  }

  const isArmed = (reminder: Reminder) => {
    return useReminderStore.getState().armedReminders.some((r) => r.id === reminder.id)
  }

  /*
   * Wether to arm a reminder
   * @param {Reminder} reminder
   *
   */
  const toArm = (reminder: Reminder) => {
    if (isArmed(reminder)) return false
    if (reminder.state.done) return false
    if (next24(reminder) || prev24(reminder)) return true
    return false
  }

  /*
   * If reminder is in next 24 hour
   */
  const prev24 = (reminder: Reminder) => {
    const now = new Date()
    const prev24t = sub(now, { hours: 24 })
    if (now.getTime() > reminder.time && reminder.time >= prev24t.getTime()) {
      return true
    }
    return false
  }

  /*
   * If reminder is in next 24 hour
   */
  const next24 = (reminder: Reminder) => {
    const now = new Date()
    const next24t = add(now, { hours: 24 })
    if (now.getTime() <= reminder.time && next24t.getTime() >= reminder.time) {
      return true
    }
    return false
  }

  /*
   * Reminders that are missed
   * Filtered from the previous week
   * Includes snoozed reminders
   */
  const missed = (reminder: Reminder) => {
    if (reminder.state.done) return false
    const now = new Date()
    const prevWeek = sub(now, { weeks: 1 })
    const isWithinWeek = prevWeek.getTime() < reminder.time && reminder.time < now.getTime()
    if (isWithinWeek) {
      return true
    }
    return false
  }

  const getMissedReminders = () => {
    const reminders = useReminderStore.getState().reminders
    return reminders.filter((reminder) => {
      return missed(reminder)
    })
  }

  /*
   * Reminders that are to be armed
   * Includes snoozed and missed reminders
   * Filtered for the arm condition in toArm
   */
  const getToArmReminders = (): { reminders: Reminder[]; time: number }[] => {
    const reminders = useReminderStore.getState().reminders
    const upcomingReminders = reminders.filter(upcoming).filter(toArm)
    const tobeArmedReminders = uniqBy(upcomingReminders, 'id')

    mog('tobeArmedReminders', {
      tobeArmedReminders,
      reminders,
      upcomingReminders
    })

    // Group by time of interval 1 minutes
    const groupedReminders: Record<number, Reminder[]> = tobeArmedReminders.reduce(
      (prev: Record<number, Reminder[]>, reminder) => {
        const timeIncludedKey: string | undefined = Object.entries(prev).reduce(
          (prev2: undefined | string, [tkey, gReminders]): undefined | string => {
            const gTime = parseInt(tkey)
            if (isInSameMinute(reminder.time, gTime)) {
              return tkey
            }
            return prev2
          },
          undefined
        )

        if (timeIncludedKey) {
          return {
            ...prev,
            [timeIncludedKey]: [...prev[timeIncludedKey], reminder]
          }
        } else {
          return {
            ...prev,
            [reminder.time]: [reminder]
          }
        }
      },
      {}
    )
    return Object.entries(groupedReminders).map(([time, reminders]) => {
      return {
        reminders,
        time: parseInt(time)
      }
    })
  }

  /*
   * Arm Reminders to send notifications
   * if a reminder is armed => notification timeout is set
   */
  const armReminders = (reminders: Reminder[], time: number) => {
    setupReminders(reminders, time)
  }

  const armMissedReminders = () => {
    const toArmRem = getToArmReminders().filter((rems) => rems.time - Date.now() <= 1000 * 60 * 5)
    const now = Date.now()
    const tenSecNow = add(now, { seconds: 5 })
    mog('ReminderArmer: Using the interval', { reminders, toArmRem })
    if (toArmRem.length === 0) {
      armReminders([], tenSecNow.getTime())
    }
  }

  const actOnReminder = (type: ReminderActions, reminder: Reminder, time?: number) => {
    switch (type) {
      case 'open':
        mog('ReminderArmer: IpcAction.ACTION_REMINDER', { type, reminder })
        // goTo(ROUTE_PATHS.node, NavigationType.push, reminder.id)
        // addReminder(reminder)
        break
      case 'delete':
        deleteReminder(reminder.id)
        break
      case 'snooze':
        if (time) snoozeReminder(reminder, time)
        break
      case 'dismiss':
        dismissReminder(reminder)
        break
      default:
        break
    }
  }

  /*
   * Setup the timeout to display notification for the reminder
   */
  const setupReminders = (reminders: Reminder[], time: number) => {
    const toArmRems = reminders.filter((reminder) => {
      if (!toArm(reminder)) {
        console.error(`Reminder does not meet arming conditions. Reminder will not be set up.`, { reminder })
      }
      return toArm(reminder)
    })

    const reminderGroup: ReminderGroup = {
      type: 'reminders',
      label: reminders.length > 1 ? 'Reminders' : 'Reminder',
      reminders: toArmRems
    }

    const missedReminderGroup = {
      type: 'missed',
      label: 'Missed',
      reminders: getMissedReminders()
    }

    const reminderGroups: ReminderGroup[] = []
    if (reminderGroup.reminders.length > 0) {
      reminderGroups.push(reminderGroup)
    }
    if (missedReminderGroup.reminders.length > 0) {
      reminderGroups.push(missedReminderGroup)
    }

    mog('reminderGroups', {
      reminderGroups,
      reminderGroup,
      missedReminderGroup
    })

    if (reminderGroups.length === 0) {
      return
    }

    const now = new Date()
    const next24t = add(now, { hours: 24 })
    if (time < now.getTime() || time > next24t.getTime()) {
      console.error(`Time is in the past. Reminder will not be set up.`, { time })
      return
    }

    const id = setTimeout(() => {
      console.log(`Reminders:`, { toArmRems })
      // Use multiple notifications
      appNotifierWindow(IpcAction.SHOW_REMINDER, AppType.MEX, {
        status: ToastStatus.WARNING,
        title: 'Reminders',
        description: 'You have reminders to complete',
        independent: true,
        attachment: reminderGroups
      })
    }, time - now.getTime())
    if (id) toArmRems.forEach(addArmReminder)
  }

  /*
   * Functions related to rendering
   */
  const getUpcomingReminders = (nodeid: string) => {
    const allNodeReminders = reminders.filter((reminder) => reminder.nodeid === nodeid)
    const upcomingReminders = allNodeReminders.filter(upcoming).sort((a, b) => {
      return a.time - b.time
    })
    return upcomingReminders
  }

  const getPastReminders = (nodeid: string) => {
    const allNodeReminders = reminders.filter((reminder) => reminder.nodeid === nodeid)
    const pastReminders = allNodeReminders.filter(past).sort((a, b) => {
      return b.time - a.time
    })
    return pastReminders
  }
  const getNodeReminders = (nodeid: string): NodeReminderGroup[] => {
    const upcomingReminders = getUpcomingReminders(nodeid)
    const pastReminders = getPastReminders(nodeid)

    const res = []

    if (upcomingReminders.length > 0) {
      res.push({
        type: 'upcoming',
        label: 'Upcoming Reminders',
        reminders: upcomingReminders
      })
    }
    if (pastReminders.length > 0) {
      res.push({
        type: 'past',
        label: 'Past Reminders',
        reminders: pastReminders
      })
    }

    return res
  }

  const clearNodeReminders = (nodeid: string) => {
    const newReminders = reminders.filter((reminder) => reminder.nodeid !== nodeid)
    setReminders(newReminders)
  }

  const getRemindersForNextNMinutes = (minutes: number) => {
    const now = new Date()
    const nextMinute = new Date(now.getTime() + minutes * 60000)
    return reminders.filter((reminder) => {
      const reminderDate = new Date(reminder.time)
      return reminderDate.getTime() > now.getTime() && reminderDate.getTime() < nextMinute.getTime()
    })
  }

  return {
    reminders,
    addReminder,
    deleteReminder,
    updateReminder,
    clearReminders,
    getTodayReminders,
    getFilteredReminders,
    getNodeReminders,
    getToArmReminders,
    clearNodeReminders,
    armReminders,
    armMissedReminders,
    clearArmedReminders,
    actOnReminder,
    getRemindersForNextNMinutes
  }
}
