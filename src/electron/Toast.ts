import { IpcAction } from '../data/IpcAction'
import { REMINDERS_DIMENSIONS } from '../services/reminders/reminders'
import { TOAST_DIMENSIONS } from '../types/toast'
import { SPOTLIGHT_WINDOW_OPTIONS } from './utils/helper'
import { BrowserWindow, screen, BrowserWindowConstructorOptions } from 'electron'

const isDevelopment = import.meta.env.MODE === 'development'

/* Toast for showing custom notifications in the app */
class Toast {
  private window: BrowserWindow | null
  private timeoutId: NodeJS.Timeout | null = null

  constructor(spotlightWindow: BrowserWindow) {
    const options: BrowserWindowConstructorOptions = {
      ...SPOTLIGHT_WINDOW_OPTIONS,
      height: TOAST_DIMENSIONS.height,
      width: TOAST_DIMENSIONS.width,
      maxHeight: 1000,
      center: false
    }

    this.window = new BrowserWindow(options)

    this.window.on('close', () => {
      this.window = null
    })

    const toastURL =
      isDevelopment && import.meta.env.VITE_TOAST_DEV_SERVER_URL !== undefined
        ? import.meta.env.VITE_TOAST_DEV_SERVER_URL
        : new URL('dist/toast.html', 'file://' + __dirname).toString()

    this.window.loadURL(toastURL)
    this.window.setParentWindow(spotlightWindow)
    // this.window.webContents.openDevTools({ mode: 'detach' })
    this.window.setAlwaysOnTop(true, 'status')
    this.window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

    this.setParent(spotlightWindow)

    this.window.on('close', () => {
      this.window = null
    })

    this.window?.webContents.on('did-finish-load', () => {
      if (!this.window) {
        throw new Error('Main Window is not initialized!')
      }

      this.window.hide()
    })
  }

  public setParent(parent: BrowserWindow) {
    this.window.setParentWindow(parent)
    // parent.setHasShadow(false)

    const bounds = parent?.getBounds()
    this.window.setPosition(
      bounds.x + bounds.width - TOAST_DIMENSIONS.width,
      bounds.y + bounds.height + TOAST_DIMENSIONS.offset
    )
  }

  public updateReminderSize(size: { height: number; width: number }, animate?: boolean) {
    const scr = screen.getDisplayNearestPoint(screen.getCursorScreenPoint())
    const bounds = scr.bounds
    // console.log({ bounds })
    const maxHeight = (bounds.height * 2) / 3
    if (size.height <= maxHeight) {
      this.window.setSize(size.width, size.height, animate)
    } else {
      this.window.setSize(size.width, maxHeight, animate)
    }
    this.window.setPosition(
      bounds.x + bounds.width - REMINDERS_DIMENSIONS.width - REMINDERS_DIMENSIONS.offset,
      bounds.y + REMINDERS_DIMENSIONS.offset
    )
  }

  public openReminder(size: { height: number; width: number }, timeout?: number) {
    if (this.window.isVisible()) {
      return
    }
    this.window.setParentWindow(null)

    this.updateReminderSize(size, true)

    this.window.showInactive()
    this.window.setHasShadow(true)

    if (this.timeoutId) clearTimeout(this.timeoutId)

    if (timeout) {
      this.timeoutId = setTimeout(() => {
        this.hide()
      }, timeout)
    }
  }
  public open(independent?: boolean, center?: boolean, noHide?: boolean) {
    if (center) this.window.center()
    if (independent) this.window.setParentWindow(null)

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
