import React, { useEffect, useState } from 'react'

import { AppType } from '@data/constants'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'

import { IpcAction } from '../../data/IpcAction'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import { ToastStatus, ToastType } from '../../types/toast'
import { mog } from '../../utils/lib/helper'
import { Description } from '../spotlight/SearchResults/styled'
import ReminderGroupsUI from './ReminderGroup'
import ToastUI from './ToastUI'

const StyledNotifier = styled.div`
  box-sizing: border-box;
  height: 100vh;
  padding: 0.5rem;
  /* display: flex; */
`

const MessageTypeColors = {
  success: '#47d347',
  error: '#d34343',
  loading: '#47d347'
}

const MessageType = styled.div<{ type: ToastStatus }>`
  padding: 0.25rem;
  border-radius: 50%;
  background-color: ${({ type }) => MessageTypeColors[type]};
  margin-right: 1rem;
  box-shadow: 0 0 0.5rem ${({ type }) => MessageTypeColors[type]};
`

const MessageNotify = styled.div`
  margin: 0.5rem;
  display: flex;
  align-items: center;
`

const Msg = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  span {
    color: ${(props) => props.theme.colors.text.default};
    font-size: 0.8rem;
    font-weight: 600;
  }
`

const StyledMsg = styled.div``

type NotifyType = 'toast' | 'reminder'

interface NotifierState {
  type: NotifyType
  message: ToastType
}

const Notifier = () => {
  const [nState, setNState] = useState<NotifierState | undefined>(undefined)

  const setTheme = useUserPreferenceStore((state) => state.setTheme)
  useEffect(() => {
    ipcRenderer.on(IpcAction.TOAST_MESSAGE, (ev, message) => {
      if (message.attachment) {
        setNState({ type: 'reminder', message })
      } else {
        setNState({ type: 'toast', message })
      }
    })
    ipcRenderer.on(IpcAction.SET_THEME, (ev, theme) => {
      setTheme(theme)
    })
  }, [])

  const closeNotifier = () => {
    appNotifierWindow(IpcAction.HIDE_TOAST, AppType.SPOTLIGHT, { hide: true })
  }

  if (nState === undefined) {
    return null
  }
  if (nState.type === 'toast') {
    return <ToastUI message={nState.message} />
  } else if (nState.type === 'reminder') {
    return <ReminderGroupsUI reminderGroups={nState.message.attachment} />
  }
}

export default Notifier
