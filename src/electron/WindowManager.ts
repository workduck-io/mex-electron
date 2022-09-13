import { IS_DEV } from '@data/Defaults/dev_'
import { IpcAction } from '@data/IpcAction'
import { mog } from '@utils/lib/helper'
import { BrowserWindow, shell } from 'electron'

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
      if (options?.onClose) options?.onClose(window)
      const closeIfDeveloping = IS_DEV || options?.deleteOnClose

      if (closeIfDeveloping === false) event.preventDefault()
      this.deleteWindow(windowId, closeIfDeveloping)
    })

    if (options?.debug && IS_DEV) window.webContents.openDevTools({ mode: 'right' })

    window.webContents?.on('new-window', (event, url) => {
      event.preventDefault()
      shell.openExternal(url)
    })

    if (options.alwaysOnTop) {
      window.setAlwaysOnTop(true, 'modal-panel', 100)
      window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
    }

    return window
  }

  public getWindow = (windowId: string): BrowserWindow => {
    const browserWindowId = this.windowRef?.[windowId]
    try {
      return BrowserWindow.fromId(browserWindowId)
    } catch (err) {
      mog('Unable to get Window from ID', { err: err.toString() })
    }
  }

  public sendToWindow = (windowId: string, ipcType: IpcAction, data?: any) => {
    const window = this.getWindow(windowId)

    if (window) window.webContents.send(ipcType, data)
  }

  public deleteWindow = (windowId: string, areYouSure = true) => {
    const window = this.getWindow(windowId)

    if (areYouSure) {
      const { [windowId]: refId, ...windows } = this.windowRef
      this.windowRef = windows
      window?.close()
    } else window?.hide()
  }
}

export const windowManager = WindowManager.getInstance()
