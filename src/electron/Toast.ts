import { BrowserWindow, screen, BrowserWindowConstructorOptions } from 'electron'

import { IpcAction } from '../data/IpcAction'
import { TOAST_DIMENSIONS } from '../types/toast'
import { SPOTLIGHT_WINDOW_OPTIONS } from './main'

declare const TOAST_WINDOW_WEBPACK_ENTRY: string

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
    // this.window.webContents.openDevTools()
    this.window.setAlwaysOnTop(true, 'status')
    this.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

    this.setParent(spotlightWindow)

    this.window.on('close', () => {
      this.window = null
    })

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

  public open(independent?: boolean, center?: boolean, noHide?: boolean, variant?: 'reminder') {
    if (center) this.window.center()
    if (independent) this.window.setParentWindow(null)

    if (variant === 'reminder') {
      const scr = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
      const bounds = scr.bounds
      this.window.setPosition(bounds.width - 200, 20)
    }

    this.window.showInactive()
    this.window.setHasShadow(true)

    if (this.timeoutId) clearTimeout(this.timeoutId)

    if (!noHide) {
      this.timeoutId = setTimeout(() => {
        this.hide()
      }, 2000)
    }
  }

  public setOnFullScreen() {
    this.window.setFullScreenable(false)
    this.window.setFullScreen(false)
    this.window.setMaximizable(false)
  }

  public send(action: IpcAction, data: any) {
    this.window && this.window?.webContents?.send(action, data)
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
