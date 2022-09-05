/* eslint-disable @typescript-eslint/no-explicit-any */
import { IS_DEV } from '@data/Defaults/dev_'
import { IpcAction } from '@data/IpcAction'
import { BrowserWindow, BrowserWindowConstructorOptions, LoadURLOptions, shell } from 'electron'

const toggleWindow = (window: any, isSelection: boolean) => {
  if (!isSelection && (window.isFocused() || window.isVisible())) {
    window.hide()
    return
  }

  window.show()
}

type LoadURLType = { url: string; options?: LoadURLOptions }

const createWindow = (options: {
  windowConstructorOptions: BrowserWindowConstructorOptions
  loadURL: LoadURLType
  onLoad?: (window?: BrowserWindow) => void
  onBlurHide?: boolean
  onLoadShow?: boolean
}): BrowserWindow => {
  const window: BrowserWindow = new BrowserWindow(options.windowConstructorOptions)
  window.loadURL(options.loadURL.url, options.loadURL.options)

  window.webContents.on('did-finish-load', () => {
    if (!window) {
      throw new Error('Unable to initialize Browser window!')
    }

    if (options.onLoad) options.onLoad(window)

    if (options.onLoadShow) {
      window.focus()
      window.show()
    }
  })

  window.on('blur', () => {
    if (options?.onBlurHide) window.hide()
    window.webContents.send(IpcAction.WINDOW_BLUR)
  })

  if (IS_DEV) window.webContents.openDevTools({ mode: 'right' })

  // Open urls in the user's browser
  window.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  return window
}

export { toggleWindow, createWindow }
