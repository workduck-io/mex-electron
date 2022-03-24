import React from 'react'
import styled from 'styled-components'
import { ToastStatus, ToastType } from '../../types/toast'
import { Description } from '../spotlight/SearchResults/styled'

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
const ToastUI = ({ message }: { message: ToastType }) => {
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

export default ToastUI
