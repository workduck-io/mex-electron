import create from 'zustand'
import { Reminder } from '../types/reminders'
import { SearchFilter } from './useFilters'

interface ReminderState {
  reminders: Reminder[]
  setReminders: (reminders: Reminder[]) => void
  addReminder(reminder: Reminder): void
  deleteReminder(id: string): void
  updateReminder(newReminder: Reminder): void
  clearReminders(): void
}

export const useReminderStore = create<ReminderState>((set) => ({
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
  clearReminders: () => set({ reminders: [] })
}))

export const useReminders = () => {
  const reminders = useReminderStore((state) => state.reminders)
  const addReminder = useReminderStore((state) => state.addReminder)
  const deleteReminder = useReminderStore((state) => state.deleteReminder)
  const updateReminder = useReminderStore((state) => state.updateReminder)
  const clearReminders = useReminderStore((state) => state.clearReminders)

  const getTodayReminders = (filter?: SearchFilter<Reminder>) => {
    const filteredReminders = filter ? getFilteredReminders(filter) : reminders
    filteredReminders.filter((reminder) => {
      const today = new Date()
      const reminderDate = new Date(reminder.time)
      return (
        reminderDate.getDate() === today.getDate() &&
        reminderDate.getMonth() === today.getMonth() &&
        reminderDate.getFullYear() === today.getFullYear()
      )
    })
  }

  const getFilteredReminders = (filter: SearchFilter<Reminder>) => {
    return reminders.filter((reminder) => {
      return filter.filter(reminder)
    })
  }

  const getNodeReminders = (nodeid: string) => {
    return reminders.filter((reminder) => reminder.nodeid === nodeid)
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
    getRemindersForNextNMinutes
  }
}
