import { ReminderGroup } from './reminders'

export enum ToastStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  LOADING = 'loading'
}

export type ToastType = {
  status: ToastStatus
  title: string
  description?: string
  independent?: boolean // if true, toast will not be closed when parent is closed
  // Provide only strict values
  attachment?: ReminderGroup[]
}

export const TOAST_DIMENSIONS = {
  height: 50,
  width: 240,
  offset: 15,
  delta: 15
}

