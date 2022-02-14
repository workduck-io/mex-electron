/* eslint-disable @typescript-eslint/no-var-requires */
import chokidar from 'chokidar'
import { app, BrowserWindow, globalShortcut, ipcMain, Menu, nativeImage, screen, session, shell, Tray } from 'electron'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'
import { mog } from '../utils/lib/helper'
import { getSaveLocation, getSearchIndexLocation } from '../data/Defaults/data'
import { trayIconBase64, twitterIconBase64 } from '../data/Defaults/images'
import { IpcAction } from '../data/IpcAction'
import { AppType } from '../hooks/useInitialize'
import { initializeSentry } from '../services/sentry'
import { FileData } from '../types/data'
import { getAppleNotes } from '../utils/importers/appleNotes'
import { sanitizeHtml } from '../utils/sanitizeHtml'
import { flexIndexKeys } from '../utils/search/flexsearch'
import MenuBuilder from './menu'
import { setupUpdateService } from './update'
import { getFileData, setFileData } from './utils/filedata'
import { getGlobalShortcut, getSelectedText, getSelectedTextSync, SelectionType } from './utils/getSelectedText'
import { checkIfAlpha } from './utils/version'

if (process.env.NODE_ENV === 'production' || process.env.FORCE_PRODUCTION) {
  initializeSentry()
}

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
// let updateCheckingFrequency = 3 * 60 * 60 * 1000
// let updateSetInterval: ReturnType<typeof setInterval> | undefined

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
      spotlight.focus()
      spotlight.show()
    } else {
      spotlight.hide()
    }
  })

  spotlight.on('blur', () => {
    spotlight.hide()
    spotlight.webContents.send(IpcAction.SPOTLIGHT_BLURRED)
  })

  spotlight.on('closed', () => {
    spotlight = null
  })

  require('@electron/remote/main').enable(spotlight.webContents)

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
    } else {
      mex.focus()
      mex.show()
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
    window.focus()
    window.show()
  }
}

const syncFileData = (data?: FileData) => {
  const fileData = data || getFileData(SAVE_LOCATION)
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

// ipcMain.on(IpcAction.SPOTLIGHT_BUBBLE, (_event, arg) => {
//   const { isClicked } = arg
//   spotlightInBubbleMode(isClicked)
// })

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
    // * permission check

    // getPermissions().then((s) => console.log('Hello'))

    global.appVersion = app.getVersion()
    globalShortcut.register('CommandOrCOntrol+Shift+L', handleToggleMainWindow)

    const icon = nativeImage.createFromDataURL(trayIconBase64)
    const twitterIcon = nativeImage.createFromDataURL(twitterIconBase64)

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
        label: 'Open Preferences',
        click: () => {
          mex?.webContents.send(IpcAction.OPEN_PREFERENCES)
          mex?.show()
        }
      },
      {
        icon: twitterIcon,
        label: 'Follow Us!',
        click: () => {
          shell.openExternal('https://twitter.com/workduckio')
        }
      },
      { type: 'separator' },
      {
        label: 'Quit Mex',
        accelerator: 'Command+Q',
        click: () => {
          mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
          app.quit()
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
  const fileData: FileData = getFileData(SAVE_LOCATION)
  const indexData: any = getIndexData()
  event.sender.send(IpcAction.RECIEVE_LOCAL_DATA, { fileData, indexData })
})

ipcMain.on(IpcAction.SET_LOCAL_INDEX, (_event, arg) => {
  const { searchIndex } = arg

  if (searchIndex) setSearchIndexData(searchIndex)
})

ipcMain.on(IpcAction.SET_LOCAL_DATA, (_event, arg) => {
  setFileData(arg, SAVE_LOCATION)
  syncFileData(arg)
})

ipcMain.on(IpcAction.CLEAR_RECENTS, (_event, arg) => {
  const { from } = arg
  notifyOtherWindow(IpcAction.CLEAR_RECENTS, from)
})

ipcMain.on(IpcAction.NEW_RECENT_ITEM, (_event, arg) => {
  const { from, data } = arg
  mog('Add new recent item', { from, data })
  notifyOtherWindow(IpcAction.NEW_RECENT_ITEM, from, data)
})

ipcMain.on(IpcAction.START_ONBOARDING, (_event, arg) => {
  const { from, data } = arg
  notifyOtherWindow(IpcAction.START_ONBOARDING, from, data)
})

ipcMain.on(IpcAction.STOP_ONBOARDING, (_event, arg) => {
  const { from } = arg
  notifyOtherWindow(IpcAction.STOP_ONBOARDING, from)
})

ipcMain.on(IpcAction.OPEN_NODE_IN_MEX, (_event, arg) => {
  mex?.webContents.send(IpcAction.OPEN_NODE, { path: arg.path })
  spotlight.hide()
  mex.show()
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

ipcMain.on(IpcAction.CLOSE_SPOTLIGHT, (_event, arg) => {
  const { data } = arg
  if (data?.hide) spotlight.hide()
})

ipcMain.on(IpcAction.IMPORT_APPLE_NOTES, async () => {
  const selectedAppleNotes = await getAppleNotes()

  if (selectedAppleNotes) mex?.webContents.send(IpcAction.SET_APPLE_NOTES_DATA, selectedAppleNotes)
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const notifyOtherWindow = (action: IpcAction, from: AppType, data?: any) => {
  if (from === AppType.MEX) spotlight?.webContents.send(action, { data })
  else mex?.webContents.send(action, { data })
}

/*
 * Setup updates
 */
if (mex) {
  setupUpdateService(mex)
}
