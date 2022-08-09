import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { GOOGLE_OAUTH_URL } from '../../../apis/routes'
import config from '../../../config.json'
import { GoogleAuthButton } from '../../../style/Buttons'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../../views/routes/urls'

export interface GoogleLoginButtonProps {
  text: string
}

export default function GoogleAuthFallback() {
  const { goTo } = useRouting()
  useEffect(() => {
    goTo(ROUTE_PATHS.login, NavigationType.push)
  }, [])

  return <></>
}

export const GoogleLoginButton = ({ text }: GoogleLoginButtonProps) => {
  const baseAuthURL = 'https://workduck.auth.us-east-1.amazoncognito.com/oauth2/authorize'
  const searchParams = new URLSearchParams({
    identity_provider: 'Google',
    response_type: 'code',
    redirect_uri: GOOGLE_OAUTH_URL,
    client_id: config.cognito.APP_CLIENT_ID,
    scope: config.cognito.SCOPES
  })

  const URLObject = new URL(baseAuthURL)
  URLObject.search = searchParams.toString()

  const authURL = URLObject.toString()

  const openUrl = (url) => {
    const newWindow = window.open(url, '_blank', 'width=500, height=500')
    if (newWindow) newWindow.opener = null
  }

  return (
    <ErrorBoundary FallbackComponent={GoogleAuthFallback}>
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
    </ErrorBoundary>
  )
}
