import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron'

import { IpcAction } from '../data/IpcAction'
import { SPOTLIGHT_WINDOW_OPTIONS } from './main'

declare const TOAST_WINDOW_WEBPACK_ENTRY: string

export enum ToastStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
  LOADING = 'loading'
}

export type ToastType = {
  status: ToastStatus
  text: string
  independent?: boolean // if true, toast will not be closed when parent is closed
}

/* Toast for showing custom notifications in the app */
class Toast {
  private window: BrowserWindow | null

  constructor(spotlightWindow: BrowserWindow) {
    const options: BrowserWindowConstructorOptions = {
      ...SPOTLIGHT_WINDOW_OPTIONS,
      height: 40,
      width: 120,
      center: false
    }

    this.window = new BrowserWindow(options)
    this.window.setParentWindow(spotlightWindow)
    this.window.webContents.openDevTools()
    this.window.setVisibleOnAllWorkspaces(true)
    this.window.loadURL(TOAST_WINDOW_WEBPACK_ENTRY)
    this.window.setIgnoreMouseEvents(true, { forward: true })
    this.window.showInactive()

    this.window.webContents.on('did-finish-load', () => {
      if (!this.window) {
        throw new Error('Main Window is not initialized!')
      }

      this.window.hide()
    })
  }

  public setParent(parent: BrowserWindow) {
    this.window.setParentWindow(parent)
    // parent.setHasShadow(false)

    const bounds = parent.getBounds()
    this.window.setPosition(bounds.x + bounds.width - 120, bounds.y + bounds.height + 10)
  }

  public open(independent: boolean) {
    if (independent) this.window.setParentWindow(null)
    this.window.showInactive()

    setTimeout(() => {
      this.hide()
    }, 2000)
  }

  public send(action: IpcAction, data: any) {
    this.window.webContents.send(action, data)
  }

  public hide() {
    this.window && this.window.hide()
  }

  public destroy() {
    this.window && this.window.close()
  }

  public getWindow() {
    return this.window
  }
}

export default Toast
