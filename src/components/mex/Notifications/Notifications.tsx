import React from 'react'

import { resolveValue, Toaster } from 'react-hot-toast'
import { Notification } from './Notifications.styled'

export const Notifications = () => {
  return (
    <Toaster position="bottom-center" reverseOrder={false} gutter={20}>
      {(t) => (
        <Notification style={{ opacity: t.visible ? 1 : 0 }}>
          {JSON.stringify(resolveValue(t?.message, t))}
        </Notification>
      )}
    </Toaster>
  )
}
