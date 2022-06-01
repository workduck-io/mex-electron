import { BrowserWindow } from 'electron'
import { IpcAction } from '../../data/IpcAction'
import { mog } from '../../utils/lib/helper'

const sanitizePath = (path: string) => (path.endsWith('/') ? path.slice(0, -1) : path)

export const getRedirectPath = (window: BrowserWindow, url: string) => {
  const urlObj = new URL(url)
  const params = urlObj.searchParams

  const path = sanitizePath(urlObj.pathname.substring(1))
  const code = params.get('code')
  const accessToken = params.get('access_token')

  if (code) {
    const type = 'login_google'

    window.webContents.send(IpcAction.OAUTH, { type, code })
  } else if (accessToken) {
    const accessToken = params.get('access_token')
    const idToken = params.get('id_token')
    const refreshToken = params.get('refresh_token')
    const type = params.get('type')
    window.webContents.send(IpcAction.OAUTH, { type, accessToken, idToken, refreshToken })
  }

  switch (path) {
    case 'integrations': {
      const actionGroupId = params.get('actionGroupId')
      mog('Redirect to integrations page', { actionGroupId })
      window.webContents.send(IpcAction.OAUTH, { type: 'integrations', actionGroupId })
      break
    }

    default: {
      mog('Redirect to path page', { path })
      window.webContents.send(IpcAction.REDIRECT_TO, { page: path })
    }
  }

  window.show()
  window.focus()
}
