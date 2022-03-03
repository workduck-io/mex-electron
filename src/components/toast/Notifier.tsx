import React, { useEffect, useState } from 'react'
import { ToastStatus, ToastType } from '../../electron/Toast'

import { AppType } from '../../hooks/useInitialize'
import { Description } from '../spotlight/SearchResults/styled'
import { Icon } from '@iconify/react'
import { IpcAction } from '../../data/IpcAction'
import { appNotifierWindow } from '../../electron/utils/notifiers'
import closeIcon from '@iconify-icons/codicon/chrome-close'
import { ipcRenderer } from 'electron'
import { mog } from '../../utils/lib/helper'
import styled from 'styled-components'
import useThemeStore from '../../store/useThemeStore'

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

const Notifier = () => {
  const [message, setMessage] = useState<ToastType>({} as ToastType)
  const setTheme = useThemeStore((store) => store.setTheme)
  useEffect(() => {
    ipcRenderer.on(IpcAction.TOAST_MESSAGE, (ev, message) => {
      mog('Message', { message }, { collapsed: false })
      setMessage(message)
    })
    ipcRenderer.on(IpcAction.SET_THEME, (ev, theme) => {
      setTheme(theme)
    })
  }, [])

  const closeNotifier = () => {
    appNotifierWindow(IpcAction.HIDE_TOAST, AppType.SPOTLIGHT, { hide: true })
  }

  return (
    <StyledNotifier>
      <MessageNotify>
        <MessageType type={message.status} />
        <StyledMsg>
          <Msg>
            <span>{message.title}</span>
          </Msg>
          {message?.description && <Description>{message.description}</Description>}
        </StyledMsg>
      </MessageNotify>
    </StyledNotifier>
  )
}

export default Notifier
