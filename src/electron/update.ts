import { BrowserWindow, app, autoUpdater, dialog, ipcMain } from 'electron'

import { IpcAction } from '../data/IpcAction'
import { backupMexJSON } from './backup'
import { checkIfAlpha } from './utils/version'
import { toast, SEARCH_INDEX_LOCATION } from './main'
import { ToastStatus } from '../types/toast'
import { deleteSearchIndexDisk } from './utils/indexData'

export const buildUpdateFeedURL = (version: string, isAlpha: boolean) => {
  const base = isAlpha ? 'https://alpha-releases.workduck.io' : 'https://releases.workduck.io'
  const platform = process.arch === 'arm64' ? 'darwin_arm64' : 'darwin'

  const url = `${base}/update/${platform}/${version}`
  return url
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleUpdateErrors = (err) => {
  console.log('There was an error, could not fetch updates: ', err.message)
}

export const setupAutoUpdates = (version: string, isAlpha: boolean, beforeQuit: () => void) => {
  const feedURL = buildUpdateFeedURL(version, isAlpha)
  autoUpdater.setFeedURL({ url: feedURL })

  autoUpdater.on('error', handleUpdateErrors)

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    console.log("Aye Aye Captain: There's an update")
    toast?.hide()

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

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
  })

  autoUpdater.on('update-available', () => {
    toast?.showMessageAfterDelay(IpcAction.TOAST_MESSAGE, {
      status: ToastStatus.SUCCESS,
      title: 'Update available!',
      description: 'Getting update..',
      dontHide: true
    })
  })

  autoUpdater.on('update-not-available', () => {
    console.log('No Update Available!')

    toast?.showMessageAfterDelay(IpcAction.TOAST_MESSAGE, { status: ToastStatus.SUCCESS, title: 'You are up to date!' })
  })

  autoUpdater.on('before-quit-for-update', () => {
    beforeQuit()
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
        mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
        deleteSearchIndexDisk(SEARCH_INDEX_LOCATION)
      }
    )

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
}
