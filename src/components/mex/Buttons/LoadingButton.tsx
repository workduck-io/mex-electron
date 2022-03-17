import React from 'react'
import { useTheme } from 'styled-components'
import { AsyncButton, AsyncButtonProps, GoogleAuthButton } from '../../../style/Buttons'
import Loading from '../../../style/Loading'
import { Icon } from '@iconify/react'

export interface LoadingButtonProps {
  children?: React.ReactNode
  loading?: boolean
  dots?: number
  /** Also disable the button with a boolean condition */
  alsoDisabled?: boolean
  buttonProps?: AsyncButtonProps
  style?: any
}

export interface GoogleLoginButtonProps {
  text: string
}

export const LoadingButton = ({ children, dots, loading, alsoDisabled, buttonProps, style }: LoadingButtonProps) => {
  const theme = useTheme()
  return (
    <AsyncButton disabled={alsoDisabled || loading} {...buttonProps} style={style}>
      {!loading && children}
      {loading && (
        <>
          <Loading transparent dots={dots ?? 5} color={theme.colors.primary} />
          {children}
        </>
      )}
    </AsyncButton>
  )
}

export const GoogleLoginButton = ({ text }: GoogleLoginButtonProps) => {
  const authURL =
    'https://workduck.auth.us-east-1.amazoncognito.com/oauth2/authorize?identity_provider=Google&redirect_uri=http://localhost:3333/oauth/desktop&response_type=token&client_id=6pvqt64p0l2kqkk2qafgdh13qe&scope=email openid profile'

  const openUrl = (url) => {
    const newWindow = window.open(url, '_blank', 'width=500, height=500')
    if (newWindow) newWindow.opener = null
  }
  return (
    <GoogleAuthButton
      large={true}
      onClick={() => {
        openUrl(authURL)
      }}
    >
      <div style={{ marginRight: 8, width: 25, height: 25, marginTop: 1 }}>
        <Icon fontSize={23} icon="flat-color-icons:google" />
      </div>
      <div>{text}</div>
    </GoogleAuthButton>
  )
}
