import { Notification } from 'electron'
import { Notification as RemoteNotification } from '@electron/remote'
import { Reminder } from '../../types/reminders'

export const showNotification = (title: string, body: string) => {
  new Notification({ title, body }).show()
}

export const showRemoteNotification = (title: string, body: string, onClickCallback: () => void) => {
  const remoteNotification = new RemoteNotification({ title, body })
  remoteNotification.show()
  remoteNotification.on('click', () => {
    onClickCallback()
  })
}

export const showReminder = (reminder: Reminder) => {
  const reminderNotification = new Notification({
    title: reminder.title,
    body: reminder.description,
    actions: [
      {
        type: 'button',
        text: 'Snooze'
      },
      {
        type: 'button',
        text: 'Dismiss'
      },
      {
        type: 'button',
        text: 'Delete'
      }
    ]
  })

  reminderNotification.on('action', (e, index) => {
    console.log('action', { e, index })
  })

  reminderNotification.show()
}
