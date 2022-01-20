import { ipcRenderer } from 'electron'
import React from 'react'
import { IpcAction } from '../../../data/IpcAction'
import { PrimaryText } from '../../../style/Integration'
import { StyledLoginContainer, MexLogin } from './styled'

const Login = () => {
  const redirectToLoginInMex = () => {
    ipcRenderer.send(IpcAction.REDIRECT_TO, { page: '/login' })
  }

  return (
    <StyledLoginContainer>
      <h2>
        <PrimaryText onClick={redirectToLoginInMex} style={{ cursor: 'pointer' }}>
          Log in&nbsp;
        </PrimaryText>{' '}
        to use<MexLogin>Spotlight</MexLogin>
      </h2>
    </StyledLoginContainer>
  )
}

export default Login
