import { IpcAction } from '@data/IpcAction'
import Toast from '@electron/Toast'
import { windows } from '@electron/main'
import MenuBuilder from '@electron/menu'
import { mog } from '@utils/lib/helper'
import { sanitizeHtml } from '@utils/sanitizeHtml'
import { session, app, BrowserWindow, screen } from 'electron'

import { windowManager } from '../WindowManager'
import { SelectionType, getSelectedTextSync, getSelectedText } from './getSelectedText'

export enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX'
}

const MEX_WINDOW_OPTIONS = {
  width: 1600,
  height: 1500,
  fullscreenable: true,
  maximizable: true,
  titleBarStyle: 'hidden' as const,
  trafficLightPosition: { x: 16, y: 8 },
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
  }
}

const PINNED_NOTES_WINDOW_OPTIONS = {
  width: 400,
  height: 500,
  minWidth: 400,
  minHeight: 400,
  vibrancy: 'popover' as any,
  maximizable: false,
  titleBarStyle: 'hidden' as const,
  trafficLightPosition: { x: 20, y: 20 },
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
  }
}

export const SPOTLIGHT_WINDOW_OPTIONS = {
  show: false,
  width: 800,
  height: 500,
  maxWidth: 800,
  vibrancy: 'popover' as any,
  maxHeight: 500,
  center: false,
  frame: false,
  maximizable: false,
  alwaysOnTop: true,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
  }
}

let spotlightBubble = false
let isSelection = false

const isDevelopment = import.meta.env.MODE === 'development'

export const createSpotLighWindow = (show?: boolean) => {
  const spotlightURL =
    isDevelopment && import.meta.env.VITE_SPOTLIGHT_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_SPOTLIGHT_DEV_SERVER_URL
      : new URL('dist/spotlight.html', 'file://' + __dirname).toString()

  return windowManager.createWindow('SPOTLIGHT', {
    windowConstructorOptions: SPOTLIGHT_WINDOW_OPTIONS,
    loadURL: { url: spotlightURL },
    onBlurHide: true, // This should be set as true
    alwaysOnTop: true,
    onLoadShow: show
  })
}

export const notifyOtherWindow = (action: IpcAction, from: AppType, data?: any) => {
  if (from === AppType.MEX) windowManager.sendToWindow(AppType.SPOTLIGHT, action, { data })
  else windowManager.sendToWindow(AppType.MEX, action, { data })
}

export const sendToRenderer = (selection: any) => {
  const ref = windowManager.getWindow(AppType.SPOTLIGHT)

  if (!selection) {
    ref.webContents.send(IpcAction.SELECTED_TEXT, selection)
    return
  }

  const text = sanitizeHtml(selection.text)
  const metaSelection = {
    ...selection,
    text
  }

  ref?.webContents.send(IpcAction.SELECTED_TEXT, metaSelection)
}

export const createNoteWindow = (dataForPreviewWindow: { from: AppType; data: any }) => {
  const noteWindow =
    isDevelopment && import.meta.env.VITE_NOTE_WINDOW_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_NOTE_WINDOW_DEV_SERVER_URL
      : new URL('dist/note.html', 'file://' + __dirname).toString()

  windowManager.createWindow(dataForPreviewWindow?.data?.noteId, {
    windowConstructorOptions: PINNED_NOTES_WINDOW_OPTIONS,
    loadURL: { url: noteWindow },
    onClose: () => {
      windowManager.sendToWindow(AppType.MEX, IpcAction.UNPIN_NOTE, { noteId: dataForPreviewWindow?.data?.noteId })
    },
    handleCloseManually: (noteWindow => {
      noteWindow?.webContents?.send(IpcAction.SAVE_AND_QUIT, { noteId: dataForPreviewWindow?.data?.noteId })
    }),
    deleteOnClose: true,
    alwaysOnTop: true,
    onLoad: (window) => {
      if (dataForPreviewWindow) {
        const { data } = dataForPreviewWindow
        window?.webContents?.send(IpcAction.PIN_NOTE_WINDOW, data)
      }
    }
  })
}

export const createMexWindow = (onLoad?: (window: BrowserWindow) => void) => {
  const mexURL =
    isDevelopment && import.meta.env.VITE_MEX_DEV_SERVER_URL !== undefined
      ? import.meta.env.VITE_MEX_DEV_SERVER_URL
      : new URL('dist/index.html', 'file://' + __dirname).toString()

  // MEX here
  const ref = windowManager.createWindow(AppType.MEX, {
    windowConstructorOptions: MEX_WINDOW_OPTIONS,
    loadURL: { url: mexURL },
    handleCloseManually: (window) => {
      window.webContents.send(IpcAction.SAVE_AND_QUIT)
    },
    onLoad: (window) => {
      if (onLoad) onLoad(window)
    },
    deleteOnClose: false
  })

  const menuBuilder = new MenuBuilder(ref)
  menuBuilder.buildMenu()

  ref.on('enter-full-screen', () => {
    const spotlightWindowRef = windowManager.getWindow(AppType.SPOTLIGHT)

    spotlightWindowRef.setFullScreen(false)
    spotlightWindowRef.setFullScreenable(false)
    spotlightWindowRef.setMaximizable(false)

    windows.toast?.setOnFullScreen()
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const callbackOptions = {
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['']
      }
    }
    callback(callbackOptions)
  })
}

const spotlightInBubbleMode = (show?: boolean) => {
  if (show) {
    windowManager.getWindow(AppType.SPOTLIGHT).setContentSize(48, 48, false)
    spotlightBubble = true
  } else {
    spotlightCenter()
    spotlightBubble = false
  }
}

export const createAllWindows = (d: any) => {
  createMexWindow((window) => {
    if (d?.update) {
      window.webContents.send(IpcAction.SHOW_RELEASE_NOTES, { update: d?.update })
    }
  })
  const spotlightWindowRef = createSpotLighWindow()

  windows.toast = new Toast(spotlightWindowRef)
  if (process.platform === 'darwin') {
    app.dock.show()
  }
}

export const closeWindow = () => {
  windowManager.getWindow(AppType.SPOTLIGHT)?.hide()
}

export const handleToggleMainWindow = async () => {
  try {
    let selection: SelectionType
    if (process.platform === 'win32') {
      selection = getSelectedTextSync()
    } else if (process.platform === 'darwin') {
      selection = await getSelectedText()
    }
    const anyContentPresent = Boolean(selection?.text)
    isSelection = anyContentPresent
    toggleMainWindow(windowManager.getWindow(AppType.SPOTLIGHT))

    if (anyContentPresent) {
      sendToRenderer(selection)
    } else {
      sendToRenderer(undefined)
    }
  } catch (err) {
    console.log('Error was: ', err)
  }
}

export const spotlightCenter = () => {
  const windowRef = windowManager.getWindow('SPOTLIGHT')
  if (!windowRef) return

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const windowBounds = windowRef.getBounds()

  const offWidth = windowBounds.x + windowBounds.width > width
  const offHeight = windowBounds.y + windowBounds.height > height

  if (offWidth && offHeight) {
    windowRef.setPosition(width - windowBounds.width, height - windowBounds.height, true)
  } else if (offWidth) {
    windowRef.setPosition(width - windowBounds.width, windowBounds.y, true)
  } else if (offHeight) {
    // windowRef.setPosition(windowBounds.x, height - windowBounds.height, true)
  } else {
    windowRef.setContentSize(700, 400)
  }
}

const toggleMainWindow = (window: BrowserWindow) => {
  if (!window) {
    createSpotLighWindow(true)
  }
  // * AFTER BUBBLE MODE
  //  else if (spotlightBubble) {
  //   if (!isSelection) {
  //     spotlight?.webContents.send(IpcAction.SPOTLIGHT_BUBBLE, { isChecked: false })
  //     spotlightInBubbleMode(false)
  //   }
  // }
  else if (window.isFocused()) {
    window.hide()
  } else {
    window.focus()
    window.show()
  }
}
