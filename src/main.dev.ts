/* eslint-disable @typescript-eslint/no-var-requires */
import chokidar from 'chokidar'
import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  ipcMain,
  Menu,
  nativeImage,
  session,
  shell,
  screen,
  Tray,
  autoUpdater
} from 'electron'
import fs from 'fs'
import path from 'path'
import { AppType } from './Data/useInitialize'
import { DefaultFileData } from './Defaults/baseData'
import { getSaveLocation, getSearchIndexLocation } from './Defaults/data'
import MenuBuilder from './menu'
import { IpcAction } from './Spotlight/utils/constants'
import {
  getGlobalShortcut,
  getSelectedText,
  SelectionType,
  getSelectedTextSync
} from './Spotlight/utils/getSelectedText'
import { sanitizeHtml } from './Spotlight/utils/sanitizeHtml'
import { FileData } from './Types/data'
import { initializeSentry } from './sentry'
import { flexIndexKeys } from './Search/flexsearch'
import _ from 'lodash'

initializeSentry()

// On windows doesn't work without disabling HW Acceleration
if (process.platform === 'win32') {
  app.disableHardwareAcceleration()
}

require('@electron/remote/main').initialize()

declare const MEX_WINDOW_WEBPACK_ENTRY: string
declare const SPOTLIGHT_WINDOW_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
  app.quit()
}

let tray: Tray | null
let mex: BrowserWindow | null
let spotlight: BrowserWindow | null
let spotlightBubble = false
let isSelection = false
let updateCheckingFrequency = 3 * 60 * 60 * 1000
let updateSetInterval: ReturnType<typeof setInterval> | undefined

export const checkIfAlpha = (version: string) => {
  return version.includes('-alpha')
}

const version = app.getVersion()
const isAlpha = checkIfAlpha(version)

let trayIconSrc = path.join(__dirname, '../..', 'assets/icon.png')
if (process.platform === 'darwin') {
  trayIconSrc = path.join(__dirname, '../..', 'assets/icons/icon16x16.png')
} else if (process.platform === 'win32') {
  trayIconSrc = path.join(__dirname, '../..', 'assets/icon.ico')
}

if (process.env.NODE_ENV === 'production' || process.env.FORCE_PRODUCTION) {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

const SAVE_LOCATION = getSaveLocation(app)
const SEARCH_INDEX_LOCATION = getSearchIndexLocation(app)
// const RESOURCES_PATH = app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../assets')

// const getAssetPath = (...paths: string[]): string => {
//   return path.join(RESOURCES_PATH, ...paths)
// }

const MEX_WINDOW_OPTIONS = {
  width: 1600,
  height: 1500,
  fullscreenable: true,
  maximizable: true,
  titleBarStyle: 'hidden' as const,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
  }
}

const SPOTLIGHT_WINDOW_OPTIONS = {
  show: false,
  width: 700,
  height: 400,
  maxWidth: 700,
  maxHeight: 400,
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

export const setFileData = (data: FileData) => {
  fs.writeFileSync(SAVE_LOCATION, JSON.stringify(data))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ensureFieldsOnJSON = (fileData: any) => {
  let toWriteFile = false
  Object.keys(DefaultFileData).forEach((value) => {
    if (!(value in fileData)) {
      fileData[value] = DefaultFileData[value]
      toWriteFile = true
    }
  })
  return { fileData, toWriteFile }
}

export const getFileData = () => {
  if (fs.existsSync(SAVE_LOCATION)) {
    const stringData = fs.readFileSync(SAVE_LOCATION, 'utf-8')

    const { fileData, toWriteFile } = ensureFieldsOnJSON(JSON.parse(stringData))
    if (toWriteFile) fs.writeFileSync(SAVE_LOCATION, JSON.stringify(fileData))
    return fileData
  } else {
    fs.writeFileSync(SAVE_LOCATION, JSON.stringify(DefaultFileData))
    return DefaultFileData
  }
}

export const getIndexData = () => {
  if (!fs.existsSync(SEARCH_INDEX_LOCATION)) return null

  const searchIndex = {}
  const keys = fs
    .readdirSync(SEARCH_INDEX_LOCATION, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((item) => item.name.slice(0, -5))

  const areSame = _.isEmpty(_.xor(keys, flexIndexKeys))
  if (!areSame) return null

  for (let i = 0, key; i < keys.length; i += 1) {
    key = keys[i]
    const data = fs.readFileSync(path.join(SEARCH_INDEX_LOCATION, `${key}.json`), 'utf8')
    searchIndex[key] = data ?? null
  }

  if (searchIndex['title.map'] === '') return null

  return searchIndex
}

export const setSearchIndexData = (index) => {
  if (!fs.existsSync(SEARCH_INDEX_LOCATION)) fs.mkdirSync(SEARCH_INDEX_LOCATION)

  Object.entries(index).forEach(([key, data]) => {
    try {
      const t = path.join(SEARCH_INDEX_LOCATION, `${key}.json`)
      const d: any = data !== 'undefined' ? data : ''
      fs.writeFileSync(t, d)
    } catch (err) {
      console.log('Error is: ', err)
    }
  })
}

const createSpotLighWindow = (show?: boolean) => {
  spotlight = new BrowserWindow(SPOTLIGHT_WINDOW_OPTIONS)

  spotlight.loadURL(SPOTLIGHT_WINDOW_WEBPACK_ENTRY)

  spotlight.setAlwaysOnTop(true, 'modal-panel', 100)
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

  if (isAlpha) spotlight.webContents.openDevTools()

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

  mex.once('close', () => {
    mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
  })

  mex.webContents.on('did-finish-load', () => {
    if (!mex) {
      throw new Error('"mexWindow" is not defined')
    }
  })

  require('@electron/remote/main').enable(mex.webContents)

  const menuBuilder = new MenuBuilder(mex)
  menuBuilder.buildMenu()

  mex.on('closed', () => {
    mex = null
  })

  mex.webContents.on('new-window', (event, url) => {
    event.preventDefault()
    shell.openExternal(url)
  })

  mex.on('enter-full-screen', () => {
    spotlight.setFullScreenable(false)
    spotlight.setFullScreen(false)
    spotlight.setMaximizable(false)
  })

  if (isAlpha) mex.webContents.openDevTools()

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
          // console.log('\n \n Sending chokidar data \n \n')
          spotlight?.webContents.send(IpcAction.SYNC_DATA, fileData)
          mex?.webContents.send(IpcAction.SYNC_DATA, fileData)
        }
      })
  } catch (e) {
    console.error(e)
  }
}

const spotlightInBubbleMode = (show?: boolean) => {
  if (show) {
    spotlight.setContentSize(48, 48, false)
    spotlightBubble = true
  } else {
    spotlightCenter()
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
    text
  }
  spotlight?.webContents.send(IpcAction.SELECTED_TEXT, metaSelection)
}

const spotlightCenter = () => {
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
  try {
    let selection: SelectionType
    if (process.platform === 'win32') {
      selection = getSelectedTextSync()
    } else if (process.platform === 'darwin') {
      selection = await getSelectedText()
    }
    const anyContentPresent = Boolean(selection?.text)
    isSelection = anyContentPresent
    toggleMainWindow(spotlight)
    if (anyContentPresent) {
      sendToRenderer(selection)
    } else {
      sendToRenderer(undefined)
    }
  } catch (err) {
    console.log('Error was: ', err)
  }
}

const closeWindow = () => {
  spotlight?.hide()
  // if (!mex) console.log('Mex window not available')
  // mex?.webContents.send(IpcAction.GET_LOCAL_INDEX)
}

app.once('before-quit', () => {
  mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
})

ipcMain.on('close', closeWindow)

ipcMain.on(IpcAction.SPOTLIGHT_BUBBLE, (_event, arg) => {
  const { isClicked } = arg
  spotlightInBubbleMode(isClicked)
})

app.on('before-quit', () => {
  console.log('App before quit')
  mex?.webContents.send(IpcAction.GET_LOCAL_INDEX)

  // mex?.webContents.send(IpcAction.SAVE_AND_QUIT)
  // spotlight?.webContents.send(IpcAction.SAVE_AND_QUIT)
})
app.on('will-quit', () => {
  console.log('App will quit')
})

app.on('quit', () => {
  console.log('App quit')
})

app
  .whenReady()
  .then(() => {
    global.appVersion = app.getVersion()
    globalShortcut.register('CommandOrCOntrol+Shift+L', handleToggleMainWindow)

    const icon = nativeImage.createFromPath(trayIconSrc)

    tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Quick Capture',
        accelerator: SPOTLIGHT_SHORTCUT,
        click: () => {
          handleToggleMainWindow()
        }
      },
      {
        label: 'New Node',
        click: () => {
          mex?.webContents.send(IpcAction.CREATE_NEW_NODE)
          mex?.show()
        }
      },
      { type: 'separator' },
      {
        label: 'Open Mex',
        click: () => {
          mex?.show()
        }
      },
      {
        label: 'Open Spotlight',
        accelerator: SPOTLIGHT_SHORTCUT,
        click: () => {
          spotlight?.show()
        }
      },
      { type: 'separator' },
      {
        enabled: false,
        label: `Mex Version ${version}`
      },
      {
        label: 'About Mex',
        role: 'about'
      },
      {
        icon: path.join(__dirname, '../..', 'assets/twitter.png'),
        label: 'Follow Us!',
        click: () => {
          shell.openExternal('https://twitter.com/workduckio')
        }
      }
    ])

    tray.setToolTip('Mex')
    tray.setContextMenu(contextMenu)
    return 0
  })
  .then(createWindow)
  .catch(console.error)

app.on('activate', () => {
  if (spotlight === null) createSpotLighWindow()
  if (mex === null) createMexWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// * TBD: Save locally
let SPOTLIGHT_SHORTCUT = 'CommandOrCOntrol+Shift+L'

ipcMain.on(IpcAction.SET_SPOTLIGHT_SHORTCUT, (event, arg) => {
  const newSpotlightShortcut = getGlobalShortcut(arg.shortcut)
  if (newSpotlightShortcut !== SPOTLIGHT_SHORTCUT) {
    globalShortcut.unregister(SPOTLIGHT_SHORTCUT)
    globalShortcut.register(newSpotlightShortcut, handleToggleMainWindow)
    SPOTLIGHT_SHORTCUT = newSpotlightShortcut
  }
})

ipcMain.on(IpcAction.DISABLE_GLOBAL_SHORTCUT, (event, arg) => {
  const { disable } = arg
  if (disable) globalShortcut.unregisterAll()
  else globalShortcut.register(SPOTLIGHT_SHORTCUT, handleToggleMainWindow) // * If more than one global listener, use regiterAll
})

ipcMain.on(IpcAction.GET_LOCAL_DATA, (event) => {
  const fileData: FileData = getFileData()
  const indexData: any = getIndexData()
  event.sender.send(IpcAction.RECIEVE_LOCAL_DATA, { fileData, indexData })
})

ipcMain.on(IpcAction.SET_LOCAL_INDEX, (_event, arg) => {
  const { searchIndex } = arg

  if (searchIndex) setSearchIndexData(searchIndex)
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

ipcMain.on(IpcAction.LOGGED_IN, (_event, arg) => {
  spotlight?.webContents.send(IpcAction.LOGGED_IN, arg)
})

ipcMain.on(IpcAction.REDIRECT_TO, (_event, arg) => {
  mex?.show()
  mex?.webContents.send(IpcAction.REDIRECT_TO, { page: arg.page })
})

ipcMain.on(IpcAction.ERROR_OCCURED, (_event, arg) => {
  // showDialog(arg.message, arg.propertes)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const notifyOtherWindow = (action: IpcAction, from: AppType, data?: any) => {
  if (from === AppType.MEX) spotlight?.webContents.send(action, { data })
  else mex?.webContents.send(action, { data })
}

export const buildUpdateFeedURL = () => {
  if (process.platform === 'darwin') {
    const base = 'https://reserv.workduck.io'
    let url: string

    if (process.arch == 'arm64') {
      url = base + `/update/osx_arm64/${version}`
    } else {
      url = base + `/update/osx_x64/${version}`
    }

    if (isAlpha) url = url + '/alpha'
    return url
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleUpdateErrors = (err) => {
  console.log('There was an error, could not fetch updates: ', err.message)
}

export const setupAutoUpdates = () => {
  const feedURL = buildUpdateFeedURL()
  autoUpdater.setFeedURL({ url: feedURL })

  console.log('Update URL is: ', feedURL)

  autoUpdater.on('error', handleUpdateErrors)

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    console.log("Aye Aye Captain: There's an update")

    const dialogOpts = {
      title: "Aye Aye Captain: There's a Mex Update!",
      type: 'info',
      buttons: ['Install Update!', 'Later'],
      message: process.platform === 'win32' ? releaseName : releaseNotes,
      detail: 'Updates are on the way'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.on('update-available', () => {
    console.log('Update Available')
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No Update Available!')
  })

  autoUpdater.on('before-quit-for-update', () => {
    mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
  })
}

if (app.isPackaged || process.env.FORCE_PRODUCTION) {
  updateCheckingFrequency = 3 * 60 * 60 * 1000
  setupAutoUpdates()

  setTimeout(() => {
    autoUpdater.checkForUpdates()
  }, 5 * 60 * 1000)

  updateSetInterval = setInterval(() => {
    autoUpdater.checkForUpdates()
  }, updateCheckingFrequency)

  ipcMain.on(IpcAction.SET_UPDATE_FREQ, (_event, arg) => {
    const { updateFreq } = arg

    clearInterval(updateSetInterval)

    updateSetInterval = setInterval(() => {
      autoUpdater.checkForUpdates()
    }, updateFreq * 60 * 60 * 1000)
    console.log(`Changed Update Freq to ${updateFreq} hours`)
  })
}
