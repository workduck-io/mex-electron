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
  title: string
  description?: string
  independent?: boolean // if true, toast will not be closed when parent is closed
}

export const TOAST_DIMENSIONS = {
  height: 50,
  width: 240,
  offset: 15,
  delta: 15
}

/* Toast for showing custom notifications in the app */
class Toast {
  private window: BrowserWindow | null
  private timeoutId: NodeJS.Timeout | null = null

  constructor(spotlightWindow: BrowserWindow) {
    const options: BrowserWindowConstructorOptions = {
      ...SPOTLIGHT_WINDOW_OPTIONS,
      height: TOAST_DIMENSIONS.height,
      width: TOAST_DIMENSIONS.width,
      center: false
    }

    this.window = new BrowserWindow(options)

    this.window.on('close', () => {
      this.window = null
    })

    this.window.loadURL(TOAST_WINDOW_WEBPACK_ENTRY)
    this.window.setParentWindow(spotlightWindow)
    this.window.setVisibleOnAllWorkspaces(true)
    // this.window.setIgnoreMouseEvents(true, { forward: true })

    // this.window.webContents.openDevTools({
    //   mode: 'detach'
    // })

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
    this.window.setPosition(
      bounds.x + bounds.width - TOAST_DIMENSIONS.width,
      bounds.y + bounds.height + TOAST_DIMENSIONS.offset
    )
  }

  public open(independent?: boolean, center?: boolean) {
    if (center) this.window.center()
    if (independent) this.window.setParentWindow(null)

    this.window.showInactive()
    this.window.setHasShadow(true)

    if (this.timeoutId) clearTimeout(this.timeoutId)

    this.timeoutId = setTimeout(() => {
      this.hide()
    }, 2000)
  }

  public send(action: IpcAction, data: any) {
    this.window && this.window.webContents?.send(action, data)
  }

  public hide() {
    this.window.setSize(TOAST_DIMENSIONS.width, TOAST_DIMENSIONS.height)
    this.window && this.window.hide()
  }

  public showMessageAfterDelay(action: IpcAction, data: any) {
    if (this.timeoutId) clearTimeout(this.timeoutId)

    this.timeoutId = setTimeout(() => {
      this?.send(action, data)

      if (data?.description) {
        this.window.setSize(TOAST_DIMENSIONS.width, TOAST_DIMENSIONS.height + TOAST_DIMENSIONS.delta, true)
      }

      if (!data?.dontHide)
        setTimeout(() => {
          this.window.hide()
        }, 1000)
    }, 1000)
  }

  public destroy() {
    this.window && this.window.destroy()
  }

  public getWindow() {
    return this.window
  }
}

export default Toast
