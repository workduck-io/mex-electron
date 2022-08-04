import { trayIconBase64, twitterIconBase64 } from '@data/Defaults/images'
import { IpcAction } from '@data/IpcAction'
import { nativeImage, Tray, Menu, app, shell } from 'electron'
import { SPOTLIGHT_SHORTCUT } from './listeners/ipc'
import { windows } from './main'
import { handleToggleMainWindow } from './utils/helper'

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
        windows.mex?.webContents.send(IpcAction.CREATE_NEW_NODE)
        windows.mex?.show()
      }
    },
    { type: 'separator' },
    {
      label: 'Open Mex',
      click: () => {
        windows.mex?.show()
      }
    },
    {
      label: 'Open Spotlight',
      accelerator: SPOTLIGHT_SHORTCUT,
      click: () => {
        windows.spotlight?.show()
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
        windows.mex?.webContents.send(IpcAction.OPEN_PREFERENCES)
        windows.mex?.show()
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
        windows.mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
        app.quit()
      }
    }
  ])

  tray.setToolTip('Mex')
  tray.setContextMenu(contextMenu)
}

export default createTray
