import { getSaveLocation } from '@data/Defaults/data'
import { IpcAction } from '@data/IpcAction'
import { windows } from '@electron/main'
import MenuBuilder from '@electron/menu'
import Toast from '@electron/Toast'
import fs from 'fs'
import chokidar from 'chokidar'
import { FileData } from '../../types/data'
import { session, app, BrowserWindow, screen } from 'electron'
import { SelectionType, getSelectedTextSync, getSelectedText } from './getSelectedText'
import { createWindow } from './window'
import { getFileData } from './filedata'
import { AppType } from '@hooks/useInitialize'
import { sanitizeHtml } from '@utils/sanitizeHtml'
import { SAVE_LOCATION } from './fileLocations'

declare const MEX_WINDOW_WEBPACK_ENTRY: string
declare const SPOTLIGHT_WINDOW_WEBPACK_ENTRY: string

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

export const createSpotLighWindow = (show?: boolean) => {
  windows.spotlight = createWindow({
    windowConstructorOptions: SPOTLIGHT_WINDOW_OPTIONS,
    loadURL: { url: SPOTLIGHT_WINDOW_WEBPACK_ENTRY },
    onBlurHide: true,
    onLoadShow: show
  })

  const spotlight = windows.spotlight

  spotlight.setAlwaysOnTop(true, 'modal-panel', 100)
  spotlight.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const notifyOtherWindow = (action: IpcAction, from: AppType, data?: any) => {
  if (from === AppType.MEX) windows.spotlight?.webContents.send(action, { data })
  else windows.mex?.webContents.send(action, { data })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendToRenderer = (selection: any) => {
  if (!selection) {
    windows.spotlight?.webContents.send(IpcAction.SELECTED_TEXT, selection)
    return
  }
  const text = sanitizeHtml(selection.text)
  const metaSelection = {
    ...selection,
    text
  }
  windows.spotlight?.webContents.send(IpcAction.SELECTED_TEXT, metaSelection)
}

export const createMexWindow = (tempData?: any) => {
  // MEX here
  windows.mex = createWindow({
    windowConstructorOptions: MEX_WINDOW_OPTIONS,
    loadURL: { url: MEX_WINDOW_WEBPACK_ENTRY },
    onLoad: () => {
      if (tempData?.update) {
        windows.mex?.webContents.send(IpcAction.SHOW_RELEASE_NOTES, { update: tempData?.update })
      }
    }
  })

  const mex = windows.mex

  const menuBuilder = new MenuBuilder(mex)
  menuBuilder.buildMenu()

  mex.on('enter-full-screen', () => {
    windows.spotlight.setFullScreenable(false)
    windows.spotlight.setFullScreen(false)
    windows.spotlight.setMaximizable(false)

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

  try {
    // Send data back if modified externally

    chokidar
      .watch(getSaveLocation(app), {
        alwaysStat: true,
        useFsEvents: false,
        awaitWriteFinish: {
          stabilityThreshold: 2000
        }
      })
      .on('change', () => {
        let fileData: FileData
        if (fs.existsSync(getSaveLocation(app))) {
          const stringData = fs.readFileSync(getSaveLocation(app), 'utf-8')
          fileData = JSON.parse(stringData)
        } else {
          return
        }

        if (fileData.remoteUpdate) {
          // spotlight?.webContents.send(IpcAction.SYNC_DATA, fileData)
          mex?.webContents.send(IpcAction.SYNC_DATA, fileData)
        }
      })
  } catch (e) {
    console.error(e)
  }
}

const spotlightInBubbleMode = (show?: boolean) => {
  if (show) {
    windows.spotlight.setContentSize(48, 48, false)
    spotlightBubble = true
  } else {
    spotlightCenter()
    spotlightBubble = false
  }
}

export const createAllWindows = (d: any) => {
  createMexWindow(d)
  createSpotLighWindow()

  windows.toast = new Toast(windows.spotlight)
  if (process.platform === 'darwin') {
    app.dock.show()
  }
}

export const syncFileData = (data?: FileData) => {
  const fileData = data || getFileData(SAVE_LOCATION)
  windows.mex?.webContents.send(IpcAction.SYNC_DATA, fileData)
  // spotlight?.webContents.send(IpcAction.SYNC_DATA, fileData)
}

export const closeWindow = () => {
  windows.spotlight?.hide()
  console.log({ isMexVISIBLE: windows.mex.isVisible() })
  // if (!mex) console.log('Mex window not available')
  // mex?.webContents.send(IpcAction.GET_LOCAL_INDEX)
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
    toggleMainWindow(windows.spotlight)

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
  const spotlight = windows.spotlight
  if (!spotlight) return

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const windowBounds = spotlight.getBounds()

  const offWidth = windowBounds.x + windowBounds.width > width
  const offHeight = windowBounds.y + windowBounds.height > height

  if (offWidth && offHeight) {
    spotlight.setPosition(width - windowBounds.width, height - windowBounds.height, true)
  } else if (offWidth) {
    spotlight.setPosition(width - windowBounds.width, windowBounds.y, true)
  } else if (offHeight) {
    spotlight.setPosition(windowBounds.x, height - windowBounds.height, true)
  } else {
    spotlight.setContentSize(700, 400)
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
