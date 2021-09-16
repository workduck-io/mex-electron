/* eslint-disable @typescript-eslint/no-var-requires */
import chokidar from 'chokidar'
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, session, shell, Tray } from 'electron'
import { getSelectedText } from './Spotlight/utils/getSelectedText'
import { sanitizeHtml } from './Spotlight/utils/sanitizeHtml'
import fs from 'fs'
import path from 'path'
import { DefaultFileData } from './Defaults/baseData'
import { getSaveLocation } from './Defaults/data'
import MenuBuilder from './menu'
import { FileData } from './Types/data'
import { IpcAction } from './Spotlight/utils/constants'
import { AppType } from './Data/useInitialize'

declare const MEX_WINDOW_WEBPACK_ENTRY: string
declare const SPOTLIGHT_WINDOW_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
  app.quit()
}

let tray
let mex: BrowserWindow | null
let spotlight: BrowserWindow | null
let spotlightBubble = false
let isSelection = false

let trayIconSrc = path.join(__dirname, '..', 'assets/icon.png')
if (process.platform === 'darwin') {
  trayIconSrc = path.join(__dirname, '..', 'assets/icons/icon16x16.png')
} else if (process.platform === 'win32') {
  trayIconSrc = path.join(__dirname, '..', 'assets/icon.ico')
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

const SAVE_LOCATION = getSaveLocation(app)
// const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../assets')

// const getAssetPath = (...paths: string[]): string => {
//   return path.join(RESOURCES_PATH, ...paths)
// }

const MEX_WINDOW_OPTIONS = {
  width: 1600,
  height: 1500,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
}

const SPOTLIGHT_WINDOW_OPTIONS = {
  show: false,
  width: 700,
  height: 400,
  maxWidth: 700,
  maxHeight: 400,
  center: false,
  alwaysOnTop: true,
  frame: false,
  maximizable: false,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
}

export const setFileData = (data: FileData) => {
  fs.writeFileSync(SAVE_LOCATION, JSON.stringify(data))
}

export const getFileData = () => {
  let fileData: FileData

  if (fs.existsSync(SAVE_LOCATION)) {
    const stringData = fs.readFileSync(SAVE_LOCATION, 'utf-8')
    fileData = JSON.parse(stringData)
  } else {
    fs.writeFileSync(SAVE_LOCATION, JSON.stringify(DefaultFileData))
    fileData = DefaultFileData
  }
  return fileData
}

const createSpotLighWindow = (show?: boolean) => {
  spotlight = new BrowserWindow(SPOTLIGHT_WINDOW_OPTIONS)
  spotlight.loadURL(SPOTLIGHT_WINDOW_WEBPACK_ENTRY)

  spotlight.setAlwaysOnTop(true, 'modal-panel', 2)
  spotlight.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  spotlight.webContents.on('did-finish-load', () => {
    if (!spotlight) {
      throw new Error('Main Window is not initialized!')
    }
    if (show) {
      spotlight.show()
    } else {
      spotlight.hide()
    }
  })

  spotlight.on('blur', () => {
    spotlight.webContents.send(IpcAction.SPOTLIGHT_BLURRED)
  })

  spotlight.on('closed', () => {
    spotlight = null
  })

  // spotlight.webContents.openDevTools()

  // Open urls in the user's browser
  spotlight.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })
}

const createMexWindow = () => {
  // MEX here
  mex = new BrowserWindow(MEX_WINDOW_OPTIONS)
  mex.loadURL(MEX_WINDOW_WEBPACK_ENTRY)

  mex.once('close', (_event) => {
    mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
  })

  mex.webContents.on('did-finish-load', () => {
    if (!mex) {
      throw new Error('"mexWindow" is not defined')
    }
    if (process.env.START_MINIMIZED) {
      mex.minimize()
    } else {
      mex.show()
    }
  })

  const menuBuilder = new MenuBuilder(mex)
  menuBuilder.buildMenu()

  mex.on('closed', () => {
    mex = null
  })

  mex.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  // mex.webContents.openDevTools()

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const callbackOptions = {
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [''],
      },
    }
    callback(callbackOptions)
  })

  try {
    // Send data back if modified externally
    console.log(getSaveLocation(app))

    chokidar
      .watch(getSaveLocation(app), {
        alwaysStat: true,
        awaitWriteFinish: {
          stabilityThreshold: 2000,
          // pollInterval: 1000,
        },
      })
      .on('change', () => {
        let fileData: FileData
        if (fs.existsSync(getSaveLocation(app))) {
          const stringData = fs.readFileSync(getSaveLocation(app), 'utf-8')
          fileData = JSON.parse(stringData)
        } else {
          return
        }

        spotlight?.webContents.send(IpcAction.SYNC_DATA, fileData)
        mex?.webContents.send(IpcAction.SYNC_DATA, fileData)
      })
  } catch (e) {
    console.log(e)
  }
}

const spotlightInBubbleMode = (show?: boolean) => {
  if (show) {
    spotlight.setContentSize(48, 48, false)
    spotlightBubble = true
  } else {
    spotlight.setContentSize(700, 400, true)
    spotlightBubble = false
  }
}

const createWindow = () => {
  createMexWindow()
  createSpotLighWindow()
  if (process.platform === 'darwin') {
    app.dock.show()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sendToRenderer = (selection: any) => {
  if (!selection) {
    spotlight?.webContents.send(IpcAction.SELECTED_TEXT, selection)
    return
  }
  const text = sanitizeHtml(selection.text)
  const metaSelection = {
    ...selection,
    text,
  }
  spotlight?.webContents.send(IpcAction.SELECTED_TEXT, metaSelection)
}

const toggleMainWindow = (window) => {
  if (!window) {
    createSpotLighWindow(true)
  } else if (spotlightBubble) {
    if (!isSelection) {
      spotlight?.webContents.send(IpcAction.SPOTLIGHT_BUBBLE, { isChecked: false })
      spotlightInBubbleMode(false)
    }
  } else if (window.isFocused()) {
    window.hide()
  } else {
    window.show()
  }
}

const syncFileData = (data?: FileData) => {
  const fileData = data || getFileData()
  mex?.webContents.send(IpcAction.SYNC_DATA, fileData)
  spotlight?.webContents.send(IpcAction.SYNC_DATA, fileData)
}

const handleToggleMainWindow = async () => {
  const selection = await getSelectedText()
  const anyContentPresent = Boolean(selection?.text)
  isSelection = anyContentPresent
  toggleMainWindow(spotlight)
  if (anyContentPresent) {
    sendToRenderer(selection)
  } else sendToRenderer(undefined)
}

const closeWindow = () => {
  spotlight?.hide()
}

app.once('before-quit', () => {
  mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
})

ipcMain.on('close', closeWindow)

ipcMain.on(IpcAction.SPOTLIGHT_BUBBLE, (_event, arg) => {
  const { isClicked } = arg
  spotlightInBubbleMode(isClicked)
})

app.on('quit', () => {
  mex?.webContents.send(IpcAction.SAVE_AND_QUIT)
  spotlight?.webContents.send(IpcAction.SAVE_AND_QUIT)
})

app
  .whenReady()
  .then(() => {
    globalShortcut.register('CommandOrControl+Shift+L', handleToggleMainWindow)

    const icon = nativeImage.createFromPath(trayIconSrc)

    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open Mex', type: 'radio' },
      { label: 'Toggle Spotlight search ', type: 'radio' },
      { label: 'Create new Mex', type: 'radio', checked: true },
      { label: 'Search', type: 'radio' },
    ])

    tray.setToolTip('Mex')
    tray.setContextMenu(contextMenu)
    return 0
  })
  .then(createWindow)
  .catch(console.log)

app.on('activate', () => {
  if (spotlight === null) createSpotLighWindow()
  if (mex === null) createMexWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on(IpcAction.GET_LOCAL_DATA, (event) => {
  const fileData: FileData = getFileData()
  event.sender.send(IpcAction.RECIEVE_LOCAL_DATA, fileData)
})

ipcMain.on(IpcAction.SET_LOCAL_DATA, (_event, arg) => {
  setFileData(arg)
  syncFileData(arg)
})

ipcMain.on(IpcAction.CLEAR_RECENTS, (_event, arg) => {
  const { from } = arg
  notifyOtherWindow(IpcAction.CLEAR_RECENTS, from)
})

ipcMain.on(IpcAction.NEW_RECENT_ITEM, (_event, arg) => {
  const { from, data } = arg
  notifyOtherWindow(IpcAction.NEW_RECENT_ITEM, from, data)
})

ipcMain.on(IpcAction.OPEN_NODE_IN_MEX, (_event, arg) => {
  mex?.webContents.send(IpcAction.OPEN_NODE, { nodeId: arg.nodeId })
})

export const notifyOtherWindow = (action: IpcAction, from: AppType, data?: any) => {
  if (from === AppType.MEX) spotlight?.webContents.send(action, { data })
  else mex?.webContents.send(action, { data })
}
