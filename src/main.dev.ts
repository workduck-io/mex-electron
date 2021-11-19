/* eslint-disable @typescript-eslint/no-var-requires */
import { app, BrowserWindow, globalShortcut, clipboard } from 'electron'
import fs from 'fs'
import path from 'path'
import { keyTap } from 'robotjs'
import activeWindow from 'active-win-universal'

declare const MEX_WINDOW_WEBPACK_ENTRY: string

export type SelectionType = {
  text: string
  metadata: activeWindow.Result | undefined
}

export const simulateCopy = () => keyTap('c', process.platform === 'darwin' ? 'command' : 'control')

export const getSelectedText = async (): Promise<SelectionType> => {
  const contentBackup = clipboard.readText()
  clipboard.clear()
  simulateCopy()
  const windowDetails = await activeWindow()

  const selectedText = clipboard.readHTML()
  clipboard.writeText(contentBackup)

  return {
    text: selectedText,
    metadata: windowDetails
  }
}

if (require('electron-squirrel-startup')) {
  app.quit()
}

let mex: BrowserWindow | null

const MEX_WINDOW_OPTIONS = {
  width: 1600,
  height: 1500,
  titleBarStyle: 'hidden' as const,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
    enableRemoteModule: true
  }
}

const createMexWindow = () => {
  mex = new BrowserWindow(MEX_WINDOW_OPTIONS)
  mex.loadURL(MEX_WINDOW_WEBPACK_ENTRY)

  global.mex = mex

  mex.on('closed', () => {
    mex = null
  })
}

const createWindow = () => {
  createMexWindow()
  mex?.webContents.openDevTools()
  if (process.platform === 'darwin') {
    app.dock.show()
  }
}

app.on('quit', () => {
  console.log('App quit')
})

const handleShortcut = async () => {
  const selection = await getSelectedText()
  console.log('Selection is: ', selection)
  const anyContentPresent = Boolean(selection?.text)
  if (anyContentPresent) {
    mex?.webContents.send('SEND_SELECTION', selection)
  }
}

app
  .whenReady()
  .then(() => {
    globalShortcut.register('CommandOrControl+Shift+L', handleShortcut)
  })
  .then(createWindow)
  .catch(console.error)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
