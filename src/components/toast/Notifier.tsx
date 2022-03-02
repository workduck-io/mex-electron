import React, { useEffect, useState } from 'react'
import { ToastStatus, ToastType } from '../../electron/Toast'

import { IpcAction } from '../../data/IpcAction'
import { ipcRenderer } from 'electron'
import styled from 'styled-components'
import useThemeStore from '../../store/useThemeStore'

const StyledNotifier = styled.div`
  box-sizing: border-box;
  height: 100vh;
  display: flex;
  justify-content: center;
`

const MessageTypeColors = {
  success: '#47d347',
  error: '#d34343'
}

const MessageType = styled.div<{ type: ToastStatus }>`
  padding: 0.25rem;
  border-radius: 50%;
  background-color: ${({ type }) => MessageTypeColors[type]};
  margin-right: 0.4rem;
  box-shadow: 0 0 0.5rem ${({ type }) => MessageTypeColors[type]};
`

const MessageNotify = styled.div`
  display: flex;
  align-items: center;
`

const Msg = styled.div`
  color: ${(props) => props.theme.colors.text.default};
  font-size: 0.8rem;
  font-weight: 600;
`

const Notifier = () => {
  const [message, setMessage] = useState<ToastType>({} as ToastType)
  const setTheme = useThemeStore((store) => store.setTheme)
  useEffect(() => {
    ipcRenderer.on(IpcAction.TOAST_MESSAGE, (ev, message) => {
      setMessage(message)
    })
    ipcRenderer.on(IpcAction.SET_THEME, (ev, theme) => {
      setTheme(theme)
    })
  }, [])

  return (
    <StyledNotifier>
      <MessageNotify>
        <MessageType type={message.status} />
        <Msg>{message.text}</Msg>
      </MessageNotify>
    </StyledNotifier>
  )
}

export default Notifier
