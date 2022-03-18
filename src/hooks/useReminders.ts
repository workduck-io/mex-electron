import { add, startOfTomorrow } from 'date-fns'
import { ipcRenderer } from 'electron'
import create from 'zustand'
import { IpcAction } from '../data/IpcAction'
import { appNotifierWindow } from '../electron/utils/notifiers'
// import { ToastStatus } from '../electron/Toast'
import { NodeReminderGroup, Reminder } from '../types/reminders'
import { ToastStatus } from '../types/toast'
import { mog } from '../utils/lib/helper'
import { SearchFilter } from './useFilters'
import { AppType } from './useInitialize'

interface ReminderState {
  reminders: Reminder[]
  armedReminders: Reminder[]
  setReminders: (reminders: Reminder[]) => void
  addReminder(reminder: Reminder): void
  deleteReminder(id: string): void
  updateReminder(newReminder: Reminder): void
  clearReminders(): void
  addArmedReminder(reminder: Reminder): void
  clearArmedReminders(): void

  modalOpen: boolean
  setModalOpen: (modalOpen: boolean) => void
}

export const useReminderStore = create<ReminderState>((set) => ({
  reminders: [],
  armedReminders: [],
  setReminders: (reminders: Reminder[]) => set({ reminders }),
  addReminder: (reminder: Reminder) => set((state) => ({ reminders: [...state.reminders, reminder] })),
  deleteReminder: (id: string) =>
    set((state) => ({
      reminders: state.reminders.filter((reminder) => reminder.id !== id)
    })),
  addArmedReminder: (reminder: Reminder) => set((state) => ({ armedReminders: [...state.armedReminders, reminder] })),
  clearArmedReminders: () => set({ armedReminders: [] }),
  updateReminder: (newReminder: Reminder) =>
    set((state) => ({
      reminders: state.reminders.map((reminder) =>
        reminder.id === newReminder.id ? { ...reminder, ...newReminder } : reminder
      )
    })),
  clearReminders: () => set({ reminders: [] }),

  modalOpen: false,
  setModalOpen: (modalOpen: boolean) => set({ modalOpen })
}))

export const useReminders = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const setReminders = useReminderStore((state) => state.setReminders)
  const addReminder = useReminderStore((state) => state.addReminder)
  const armedReminders = useReminderStore((state) => state.armedReminders)
  const addArmedReminder = useReminderStore((state) => state.addArmedReminder)
  const deleteReminder = useReminderStore((state) => state.deleteReminder)
  const updateReminder = useReminderStore((state) => state.updateReminder)
  const clearReminders = useReminderStore((state) => state.clearReminders)

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
    const reminderDate = new Date(reminder.time)
    return today.getTime() <= reminderDate.getTime()
  }

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

  const armReminders = (reminders: Reminder[]) => {
    const upcomingReminders = reminders.filter(upcoming)
    mog('Arming', { upcomingReminders })
    upcomingReminders.forEach((reminder) => {
      const reminderDate = new Date(reminder.time)
      const now = new Date()
      const next24 = add(now, { hours: 24 })
      if (reminderDate.getTime() < next24.getTime()) {
        //
        setupReminder(reminder)
      }
    })
  }

  const setupReminder = (reminder: Reminder) => {
    const now = new Date()
    const limit = add(now, { hours: 24 })
    if (reminder.time > limit.getTime()) {
      console.error(
        `Reminder time is too far in the future. Reminder will not be set up. Limit time: ${limit.toISOString()}`
      )
      return
    }
    const inArmed = armedReminders.find((armed) => armed.id === reminder.id)
    if (inArmed) {
      console.error(`Reminder is already armed. Reminder will not be set up.`)
      return
    }
    const id = setTimeout(() => {
      console.log(`Reminder: ${reminder.title}`)

      appNotifierWindow(IpcAction.SHOW_NOTIFICATION, AppType.MEX, {
        status: ToastStatus.WARNING,
        title: reminder.title,
        description: reminder.description,
        independent: true
      })
      // ipcRenderer.send(IpcAction.SHOW_NOTIFICATION, {
      //   status: ToastStatus.WARNING,
      //   title: reminder.title,
      //   description: reminder.description,
      //   independent: true // if true, toast will not be closed when parent is closed
      // })
    }, reminder.time - now.getTime())
    addArmedReminder(reminder)
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
    clearNodeReminders,
    armReminders,
    getRemindersForNextNMinutes
  }
}
