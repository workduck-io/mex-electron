import { IpcAction } from '@data/IpcAction'
import { windows } from '@electron/main'
import Toast from '@electron/Toast'
import createTray from '@electron/tray'
import { setupUpdateService } from '@electron/update'
import { getDataOfLocation } from '@electron/utils/filedata'
import { SEARCH_INDEX_LOCATION, TEMP_DATA_BEFORE_UPDATE } from '@electron/utils/fileLocations'
import { handleToggleMainWindow, createAllWindows, createMexWindow, createSpotLighWindow } from '@electron/utils/helper'
import extensionsForDevX from '@electron/utils/installExtensions'
import { getRedirectPath } from '@electron/utils/redirect'
import { dumpIndexDisk } from '@electron/worker/controller'
import { app, BrowserWindow, globalShortcut } from 'electron'

export type WindowsType = { spotlight?: BrowserWindow; mex?: BrowserWindow; toast?: Toast }

const appEventListeners = () => {
  app
    .whenReady()
    .then(() => {
      extensionsForDevX()

      // * If updated
      const tempData = getDataOfLocation(TEMP_DATA_BEFORE_UPDATE)

      global.appVersion = app.getVersion()
      globalShortcut.register('CommandOrControl+Shift+X', handleToggleMainWindow)

      createTray()

      return tempData
    })
    .then((d) => createAllWindows(d))
    .then(() => setupUpdateService(windows.mex))
    .catch(console.error)

  app.on('activate', () => {
    if (windows.mex === null) createMexWindow()
    if (windows.spotlight === null) createSpotLighWindow()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.once('before-quit', () => {
    windows?.mex?.webContents.send(IpcAction.SAVE_AND_EXIT)
  })

  app.on('before-quit', async () => {
    console.log('App before quit')
    await dumpIndexDisk(SEARCH_INDEX_LOCATION)
  })

  app.on('will-quit', () => {
    console.log('App will quit')
  })

  app.on('quit', () => {
    console.log('App quit')
  })

  app.removeAsDefaultProtocolClient('mex')
  app.setAsDefaultProtocolClient('mex')

  app.on('open-url', function (event, url) {
    event.preventDefault()

    getRedirectPath(windows.mex, url)
  })
}

export default appEventListeners
