import config from '../../../apis/config'
import { useAuthentication } from '../../../services/auth/useAuth'
import { useTokens } from '../../../services/auth/useTokens'
import toast from 'react-hot-toast'
import { ipcRenderer } from 'electron'
import { GOOGLE_OAUTH_URL } from '../../../apis/routes'
import { IpcAction } from '../../../data/IpcAction'
import useActions from '../../spotlight/Actions/useActions'
import { mog } from '../../../utils/lib/helper'

export const useRedirectAuth = () => {
  const { addGoogleCalendarToken } = useTokens()
  const { loginViaGoogle } = useAuthentication()
  const { setActionsInList, getAuthorizedGroups } = useActions()

  const redirectAuthHandler = () => {
    ipcRenderer.on(IpcAction.OAUTH, async (event, data) => {
      const type = data.type

      mog('OAuth', { data })

      switch (type) {
        case 'login_google':
          await loginViaGoogle(data.code, config.cognito.APP_CLIENT_ID, GOOGLE_OAUTH_URL)
          break
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
              getAuthorizedGroups(true)
              setActionsInList(data.actionGroupId)
            }
          } catch (error) {
            toast('Something went wrong!')
          }

          break
        default:
          mog('Unknown OAuth Type', { type })
          toast('Something went wrong')
      }
    })
  }

  return {
    redirectAuthHandler
  }
}
