import { trayIconBase64, twitterIconBase64 } from '@data/Defaults/images'
import { IpcAction } from '@data/IpcAction'
import { AppType } from '@hooks/useInitialize'
import { nativeImage, Tray, Menu, app, shell } from 'electron'
import { SPOTLIGHT_SHORTCUT } from './listeners/ipc'
import { createMexWindow, handleToggleMainWindow } from './utils/helper'
import { windowManager } from './WindowManager'

const createTray = () => {
  const icon = nativeImage.createFromDataURL(trayIconBase64)
  const twitterIcon = nativeImage.createFromDataURL(twitterIconBase64)

  const tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Quick Capture',
      accelerator: SPOTLIGHT_SHORTCUT,
      click: () => {
        handleToggleMainWindow()
      }
    },
    {
      label: 'New Note',
      click: () => {
        const mexRef = windowManager?.getWindow(AppType.MEX)
        if (!mexRef) {
          createMexWindow((window) => {
            window.webContents.send(IpcAction.CREATE_NEW_NODE)
          })
        } else {
          windowManager.sendToWindow(AppType.MEX, IpcAction.CREATE_NEW_NODE)
          windowManager?.getWindow(AppType.MEX)?.show()
        }

      }
    },
    { type: 'separator' },
    {
      label: 'Open Mex',
      click: () => {
        const mexRef = windowManager.getWindow(AppType.MEX)
        if (!mexRef) createMexWindow()

        windowManager.getWindow(AppType.MEX)?.show()
      }
    },
    {
      label: 'Open Spotlight',
      accelerator: SPOTLIGHT_SHORTCUT,
      click: () => {
        windowManager.getWindow(AppType.SPOTLIGHT)?.show()
      }
    },
    { type: 'separator' },
    {
      enabled: false,
      label: `Mex Version ${app.getVersion()}`
    },
    {
      label: 'About Mex',
      role: 'about'
    },
    {
      label: 'Open Preferences',
      click: () => {
        const mexRef = windowManager.getWindow(AppType.MEX)
        if (!mexRef) {
          createMexWindow((window) => {
            window.webContents.send(IpcAction.OPEN_PREFERENCES)
          })
        } else {
          windowManager.sendToWindow(AppType.MEX, IpcAction.OPEN_PREFERENCES)
          windowManager.getWindow(AppType.MEX)?.show()
        }
      }
    },
    {
      icon: twitterIcon,
      label: 'Follow Us!',
      click: () => {
        shell.openExternal('https://twitter.com/workduckio')
      }
    },
    { type: 'separator' },
    {
      label: 'Quit Mex',
      accelerator: 'Command+Q',
      click: () => {
        windowManager.sendToWindow(AppType.MEX, IpcAction.SAVE_AND_EXIT)
        app.quit()
      }
    }
  ])

  tray.setToolTip('Mex')
  tray.setContextMenu(contextMenu)
}

export default createTray
