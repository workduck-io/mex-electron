import { AppType } from '@hooks/useInitialize'
import { BrowserWindow, Menu, MenuItemConstructorOptions, app, shell, dialog } from 'electron'
import fs from 'fs/promises'
import path from 'path'

import { getSaveLocation, DataFileName } from '../data/Defaults/data'
import { IpcAction } from '../data/IpcAction'
import { ToastStatus } from '../types/toast'
import { windows } from './main'
import { checkForUpdatesAndNotifyWrapper } from './update'
import { checkIfAlpha } from './utils/version'
import { windowManager } from './WindowManager'

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string
  submenu?: DarwinMenuItemConstructorOptions[] | Menu
}

const isAlpha = checkIfAlpha(app.getVersion())

export default class MenuBuilder {
  mainWindow: BrowserWindow

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
  }

  buildMenu(): Menu {
    if (process.env.MODE === 'development' || process.env.DEBUG_PROD === 'true') {
      this.setupDevelopmentEnvironment()
    }

    const template = process.platform === 'darwin' ? this.buildDarwinTemplate() : this.buildDefaultTemplate()

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    return menu
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow?.webContents.on('context-menu', (_, props) => {
      const { x, y } = props

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow?.webContents.inspectElement(x, y)
          }
        }
      ]).popup({ window: this.mainWindow })
    })
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Mex',
      submenu: [
        {
          label: 'About Mex',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        { type: 'separator' },
        {
          label: 'Check for Updates',
          click: () => {
            windows.toast?.send(IpcAction.TOAST_MESSAGE, {
              status: ToastStatus.LOADING,
              title: 'Checking for updates..'
            })
            windows.toast?.open(true, true, false)
            checkForUpdatesAndNotifyWrapper()
          }
        },
        { type: 'separator' },
        {
          label: 'Hide Mex',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    }

    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    }
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload()
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            windowManager.getWindow(AppType.MEX)?.webContents.openDevTools()
            windowManager.getWindow(AppType.SPOTLIGHT)?.webContents.openDevTools()
          }
        },
        {
          label: 'Export mex.json for debugging',
          click: async () => {
            const selectedFiles = await dialog.showOpenDialog({
              defaultPath: '~/',
              properties: ['openDirectory', 'createDirectory'],
              message: 'Choose where you would like to export mex.json'
            })
            if (selectedFiles.canceled) return null

            const srcPath = getSaveLocation(app)
            const destPath = path.join(selectedFiles.filePaths[0], DataFileName)
            await fs.copyFile(srcPath, destPath)
            windows.toast?.send(IpcAction.TOAST_MESSAGE, { status: ToastStatus.SUCCESS, title: 'Exported mex.json' })
            windows.toast?.open(true, true, false)
          }
        },
        {
          label: 'Share mex.json for debugging',
          role: 'shareMenu',
          sharingItem: {
            filePaths: [getSaveLocation(app)]
          }
        }
      ]
    }
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
          }
        }
      ]
    }
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    }
    const subMenuView =
      process.env.MODE === 'development' || process.env.DEBUG_PROD === 'true' || isAlpha
        ? subMenuViewDev
        : subMenuViewProd

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow]
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.mainWindow.close()
            }
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.MODE === 'development' || process.env.DEBUG_PROD === 'true'
            ? [
              {
                label: '&Reload',
                accelerator: 'Ctrl+R',
                click: () => {
                  this.mainWindow?.webContents.reload()
                }
              },
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                }
              },
              {
                label: 'Toggle &Developer Tools',
                accelerator: 'Alt+Ctrl+I',
                click: () => {
                  this.mainWindow?.webContents.toggleDevTools()
                }
              }
            ]
            : [
              {
                label: 'Toggle &Full Screen',
                accelerator: 'F11',
                click: () => {
                  this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen())
                }
              }
            ]
      }
    ]

    return templateDefault
  }
}
