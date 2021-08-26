import chokidar from 'chokidar'
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, session, shell, Tray } from 'electron'
import toggleWindow from './Spotlight/utils/toggleWindow'
import { getSelectedText } from './Spotlight/utils/getSelectedText'
import { sanitizeHtml } from './Spotlight/utils/sanitizeHtml'
import fs from 'fs'
import path from 'path'
import { DefaultFileData } from './Defaults/baseData'
import { getSaveLocation } from './Defaults/data'
import MenuBuilder from './menu'
import { FileData } from './Types/data'

declare const MEX_WINDOW_WEBPACK_ENTRY: string
declare const SPOTLIGHT_WINDOW_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

let tray
let mex: BrowserWindow | null
let spotlight: BrowserWindow | null = null

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
const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../assets')

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths)
}

const MEX_WINDOW_OPTIONS = {
  width: 2560,
  height: 1660,
  show: false,
  icon: getAssetPath('icon.png'),
  webPreferences: {
    nodeIntegration: true,
    enableRemoteModule: true,
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
  icon: getAssetPath('icon.png'),
  webPreferences: {
    nodeIntegration: true,
    nodeIntegrationInSubFrames: false,
    enableRemoteModule: true,
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

const createSpotLighWindow = () => {
  spotlight = new BrowserWindow(SPOTLIGHT_WINDOW_OPTIONS)
  spotlight.loadURL(SPOTLIGHT_WINDOW_WEBPACK_ENTRY)

  spotlight.setAlwaysOnTop(true, 'floating', 1)
  spotlight.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  spotlight.webContents.on('did-finish-load', () => {
    if (!spotlight) {
      throw new Error('Main Window is not initialized!')
    }
    if (process.env.START_MINIMIZED) {
      spotlight.minimize()
    }
  })

  spotlight.on('closed', () => {
    spotlight = null
  })

  // spotlight.webContents.openDevTools();

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

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [''],
      },
    })
  })

  try {
    // Send data back if modified externally
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

        if (spotlight) {
          spotlight.webContents.send('sync-data', fileData)
        }
      })
  } catch (e) {
    console.log(e)
  }
}

const createWindow = () => {
  createMexWindow()
  createSpotLighWindow()
  if (process.platform === 'darwin') {
    app.dock.show()
  }
}

const sendToRenderer = (selection: any) => {
  const text = sanitizeHtml(selection.text)
  const metaSelection = {
    ...selection,
    text,
  }
  spotlight?.webContents.send('selected-text', metaSelection)
}

const toggleMainWindow = (window, isSelection) => {
  if (!window) {
    createSpotLighWindow()
  } else {
    toggleWindow(window, isSelection)
  }
}

const handleSelectedText = async () => {
  const selection = await getSelectedText()
  if (selection.text && selection.metadata) {
    sendToRenderer(selection)
  }

  return selection.text && selection.metadata
}

const syncFileData = () => {
  const fileData: FileData = getFileData()
  spotlight?.webContents.send('recieve-local-data', fileData)
}

const handleToggleMainWindow = async () => {
  const isSelection = await handleSelectedText()
  toggleMainWindow(spotlight, isSelection)
  syncFileData()
}

const closeWindow = () => {
  spotlight?.close()
}

// app.on('browser-window-blur', () => {
//   app?.hide();
// });

ipcMain.on('close', closeWindow)

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

// app.on('activate', () => {
//   if (mainWindow === null) createSpotLighWindow();
//   if (mexWindow === null) createMexWindow();
// });

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

ipcMain.on('get-local-data', (event) => {
  let fileData: FileData = getFileData()
  event.sender.send('recieve-local-data', fileData)
})

ipcMain.on('set-local-data', (_event, arg) => {
  setFileData(arg)
})
