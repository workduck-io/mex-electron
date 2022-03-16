import { PriorityType } from '../editor/Components/Todo/types'

export const REMINDER_PREFIX = 'REMINDER_'

type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface WeeklyFrequency {
  type: 'weekly'
  week: [
    {
      day: Weekday
      freq: RepeatFrequency | OnceFrequency
    }
  ]
}

interface RepeatFrequency {
  type: 'repeat'
  /*
   * The times at which the event should occur.
   * All times in the array must be of the same day.
   */
  startTime: number
  endTime: number
  interval: number
  skip?: number
}

interface OnceFrequency {
  type: 'once'
  time: number
}

export type ReminderFrequency = OnceFrequency | RepeatFrequency | WeeklyFrequency

export interface Reminder {
  id: string
  title: string
  description?: string
  nodeid: string
  createdAt: number
  updatedAt: number
  time: number
  frequency?: ReminderFrequency
  priority?: PriorityType
  blockid?: string
}

export type ReminderActions = 'snooze' | 'open' | 'dismiss' | 'delete'
