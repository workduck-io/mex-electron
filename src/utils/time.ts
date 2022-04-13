import { formatDistanceToNow, formatRelative, format, add, startOfTomorrow, sub, startOfToday } from 'date-fns'
import { capitalize } from './lib/strings'

export const toLocaleString = (date: Date) => {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  })
}

export const getCurrentTimeString = (fmt: string): string => {
  return format(new Date(), fmt)
}

export const getRelativeDate = (date: Date): string => {
  const today = startOfToday()
  const sevenDaysAgo = sub(today, { days: 6, hours: 12 })
  const sevenDaysAfter = add(today, { days: 6, hours: 12 })
  if (date.getTime() < sevenDaysAgo.getTime() || date.getTime() > sevenDaysAfter.getTime()) {
    return toLocaleString(date)
  } else {
    return capitalize(formatRelative(date, new Date()))
  }
}

// If the two time are within same min
export const isInSameMinute = (time1: number, time2: number) => {
  const diff = Math.abs(time1 - time2)
  return diff < 60000
}

export const getRelativeTime = (date: Date): string => {
  const dateStr = formatDistanceToNow(date, { addSuffix: true })
  // mog('DateFormat', { dateStr })
  return dateStr
}

export const getNextReminderTime = () => {
  /*
   * Get 10 AM of the next day
   */
  // const tomorrow = startOfTomorrow()
  const today = Date.now()
  const nextFifteenMinute = add(today, { minutes: 15 })
  // const nextDay10AM = add(tomorrow, { hours: 10 })
  return nextFifteenMinute
}
