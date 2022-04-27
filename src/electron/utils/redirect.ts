import { BrowserWindow } from 'electron'
import { IpcAction } from '../../data/IpcAction'
import { mog } from '../../utils/lib/helper'

export const getRedirectPath = (window: BrowserWindow, url: string) => {
  const urlObj = new URL(url)
  const params = urlObj.searchParams

  const path = urlObj.pathname.substring(1)

  switch (path) {
    case 'integrations/': {
      const actionGroupId = params.get('actionGroupId')
      mog('Redirect to integrations page', { actionGroupId })
      window.webContents.send(IpcAction.OAUTH, { type: 'integrations', actionGroupId })
      break
    }

    default: {
      const code = params.get('code')

      if (code) {
        const type = 'login_google'

        window.webContents.send(IpcAction.OAUTH, { type, code })
      } else {
        const accessToken = params.get('access_token')
        const idToken = params.get('id_token')
        const refreshToken = params.get('refresh_token')
        const type = params.get('type')

        window.webContents.send(IpcAction.OAUTH, { type, accessToken, idToken, refreshToken })
      }
    }
  }

  window.show()
  window.focus()
}
