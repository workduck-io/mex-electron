import { IS_DEV } from '@data/Defaults/dev_'
import { IpcAction } from '@data/IpcAction'
import { AppType } from '@hooks/useInitialize'
import { mog } from '@utils/lib/helper'
import { app, BrowserWindow, shell } from 'electron'

import { WindowOptions } from '../types/window.types'

class WindowManager {
  private windowRef: Record<string, number>
  private static instance: WindowManager

  private constructor() {
    mog('Window Manager initialzing..')
  }

  public static getInstance(): WindowManager {
    if (!WindowManager.instance) {
      WindowManager.instance = new WindowManager()
    }

    return WindowManager.instance
  }

  public createWindow = (windowId: string, options: WindowOptions): BrowserWindow => {
    const browserWindowId = this.windowRef?.[windowId]
    if (browserWindowId) return BrowserWindow.fromId(browserWindowId)

    const window = new BrowserWindow(options.windowConstructorOptions)
    this.windowRef = { ...this.windowRef, [windowId]: window.id }
    window.loadURL(options.loadURL.url, options.loadURL.options)

    window.webContents.on('did-finish-load', () => {
      if (!window) {
        throw new Error('Unable to initialize Browser window!')
      }

      if (options.onLoad) options?.onLoad(window)

      if (options.onLoadShow) {
        window.focus()
        window.show()
      }

    })

    window.on('blur', () => {
      if (options?.onBlurHide) window.hide()
      window.webContents.send(IpcAction.WINDOW_BLUR)
    })

    window.on('close', (event) => {
      const { handleCloseManually, deleteOnClose } = options
      if (options?.onClose) options.onClose(window)

      if ((deleteOnClose === false && handleCloseManually) && !IS_DEV) {
        handleCloseManually(window)
        event.preventDefault()
        window.hide()
      }
    })

    window.on('closed', () => {
      this.cleanUp(windowId)
    })

    if (IS_DEV) window.webContents.openDevTools({ mode: 'right' })

    window.webContents?.on('new-window', (event, url) => {
      event.preventDefault()
      shell.openExternal(url)
    })

    if (options.alwaysOnTop) {
      window.setAlwaysOnTop(true, 'modal-panel', 100)
      window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

      if (!app.dock.isVisible())
        app.dock.show()
    }

    return window
  }

  public getWindow = (windowId: string): BrowserWindow => {
    const browserWindowId = this.windowRef?.[windowId]
    try {
      if (browserWindowId)
        return BrowserWindow.fromId(browserWindowId)
    } catch (err) {
      mog('Unable to get Window from ID', { err: err.toString() })
    }
  }

  public closeAllWindows = () => {
    const allWindows = this.windowRef

    if (allWindows) {
      Object.keys(allWindows).forEach(windowId => this.deleteWindow(windowId))
    }
  }

  public hideAllWindows = (excludeWindows: Array<string> = [AppType.SPOTLIGHT]) => {
    const allWindows = this.windowRef

    if (allWindows) {
      const windowsToClose = Object.keys(allWindows).filter(windowId => !excludeWindows.includes(windowId))
      windowsToClose.forEach(windowId => this.getWindow(windowId)?.minimize())
    }
  }

  public sendToWindow = (windowId: string, ipcType: IpcAction, data?: any) => {
    const window = this.getWindow(windowId)

    if (window) window.webContents.send(ipcType, data)
  }

  public cleanUp = (windowId: string) => {
    const { [windowId]: refId, ...windows } = this.windowRef
    this.windowRef = windows
  }

  public deleteWindow = (windowId: string, areYouSure = true) => {
    const window = this.getWindow(windowId)

    if (areYouSure) {
      this.cleanUp(windowId)

      window?.destroy()
    } else {
      window?.hide()
    }
  }
}

export const windowManager = WindowManager.getInstance()
