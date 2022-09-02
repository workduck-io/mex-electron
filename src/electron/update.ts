import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

import { IpcAction } from '../data/IpcAction'
import { ToastStatus } from '../types/toast'
import { backupMexJSON } from './backup'
import { windows } from './main'
import { TEMP_DATA_BEFORE_UPDATE, SEARCH_INDEX_LOCATION } from './utils/fileLocations'
import { setDataAtLocation } from './utils/filedata'
import { deleteSearchIndexDisk } from './utils/indexData'
import { checkIfAlpha } from './utils/version'

const logger = require('electron-log') // eslint-disable-line
logger.transports.file.level = 'info'
autoUpdater.logger = logger

export const checkForUpdatesAndNotifyWrapper = async () => {
  const authAWSStore = JSON.parse(
    await windows.mex?.webContents.executeJavaScript('localStorage.getItem("auth-aws");', true)
  )
  const token = authAWSStore.state.token ?? authAWSStore.state.userCred.token
  autoUpdater.addAuthHeader(token)
  autoUpdater.checkForUpdatesAndNotify()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleUpdateErrors = (err) => {
  console.log('There was an error, could not fetch updates: ', err.message)
}

export const setupAutoUpdates = (version: string, isAlpha: boolean, beforeQuit: () => void) => {
  autoUpdater.on('error', handleUpdateErrors)

  autoUpdater.on('update-downloaded', (info) => {
    console.log("Aye Aye Captain: There's an update")
    windows.toast?.hide()

    const dialogOpts = {
      title: "Aye Aye Captain: There's a Mex Update!",
      type: 'info',
      buttons: ['Install Update!', 'Later'],
      message: process.platform === 'win32' ? info.releaseName : (info.releaseNotes as string),
      detail: 'Updates are on the way'
    }

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) autoUpdater.quitAndInstall()
    })

    beforeQuit()
  })

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
  })

  autoUpdater.on('update-available', (info) => {
    windows.toast?.showMessageAfterDelay(IpcAction.TOAST_MESSAGE, {
      status: ToastStatus.SUCCESS,
      title: 'Update available!',
      description: `Getting version ${info.version}`,
      dontHide: true
    })
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No Update Available!')

    windows.toast?.showMessageAfterDelay(IpcAction.TOAST_MESSAGE, {
      status: ToastStatus.SUCCESS,
      title: 'You are up to date!'
    })
  })
}

export const setupUpdateService = (mex: BrowserWindow) => {
  if (app.isPackaged || process.env.FORCE_PRODUCTION) {
    const updateCheckingFrequency = 3 * 60 * 60 * 1000
    let updateSetInterval: ReturnType<typeof setInterval> | undefined
    const version = app.getVersion()
    const isAlpha = checkIfAlpha(version)

    setupAutoUpdates(
      version,
      isAlpha,

      () => {
        backupMexJSON()
        setDataAtLocation({ update: true }, TEMP_DATA_BEFORE_UPDATE)
        mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
        deleteSearchIndexDisk(SEARCH_INDEX_LOCATION)
      }
    )

    setTimeout(() => {
      checkForUpdatesAndNotifyWrapper()
    }, 5 * 60 * 1000)

    updateSetInterval = setInterval(() => {
      checkForUpdatesAndNotifyWrapper()
    }, updateCheckingFrequency)

    ipcMain.on(IpcAction.SET_UPDATE_FREQ, (_event, arg) => {
      const { updateFreq } = arg

      clearInterval(updateSetInterval)

      updateSetInterval = setInterval(() => {
        checkForUpdatesAndNotifyWrapper()
      }, updateFreq * 60 * 60 * 1000)
      console.log(`Changed Update Freq to ${updateFreq} hours`)
    })
  }
}
