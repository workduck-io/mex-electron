import { ipcRenderer } from 'electron'
import toast from 'react-hot-toast'

import { GOOGLE_OAUTH_URL } from '../../../apis/routes'
import config from '../../../config.json'
import { IpcAction } from '../../../data/IpcAction'
import { useAuthentication, useInitializeAfterAuth } from '../../../services/auth/useAuth'
import { useTokens } from '../../../services/auth/useTokens'
import useActions from '../../spotlight/Actions/useActions'

export const useRedirectAuth = () => {
  const { addGoogleCalendarToken } = useTokens()
  const { loginViaGoogle } = useAuthentication()
  const { getAuthorizedGroups } = useActions()
  const { initializeAfterAuth } = useInitializeAfterAuth()

  const redirectAuthHandler = () => {
    ipcRenderer.on(IpcAction.OAUTH, async (event, data) => {
      const type = data.type
      switch (type) {
        case 'login_google': {
          await loginViaGoogle(data.code, config.cognito.APP_CLIENT_ID, GOOGLE_OAUTH_URL)
          const { loginData } = await loginViaGoogle(data.code, config.cognito.APP_CLIENT_ID, GOOGLE_OAUTH_URL)
          await initializeAfterAuth(loginData, true, true, false)
          break
        }
        case 'calendar_google':
          addGoogleCalendarToken({
            accessToken: data.accessToken,
            idToken: data.idToken,
            refreshToken: data.refreshToken
          })
          break
        case 'integrations':
          // TODO: * Fetch all the connected integrations

          // * Update the store for changed integrations
          try {
            if (data.actionGroupId) {
              // * Get auth and config of the group
              getAuthorizedGroups(true)
            }
          } catch (error) {
            toast('Something went wrong!')
          }
          break
        default:
          toast('Something went wrong')
      }
    })
  }

  return {
    redirectAuthHandler
  }
}
