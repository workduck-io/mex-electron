import { IpcAction } from '@data/IpcAction'
import Toast from '@electron/Toast'
import createTray from '@electron/tray'
import { setupUpdateService } from '@electron/update'
import { SEARCH_INDEX_LOCATION, TEMP_DATA_BEFORE_UPDATE } from '@electron/utils/fileLocations'
import { getDataOfLocation } from '@electron/utils/filedata'
import { handleToggleMainWindow, createAllWindows, createMexWindow, createSpotLighWindow } from '@electron/utils/helper'
import extensionsForDevX from '@electron/utils/installExtensions'
import { getRedirectPath } from '@electron/utils/redirect'
import { dumpIndexDisk } from '@electron/worker/controller'
import { app, globalShortcut } from 'electron'
import { windowManager } from '@electron/WindowManager'
import { AppType } from '@hooks/useInitialize'

export type WindowsType = { toast?: Toast }

const appEventListeners = () => {
  app
    .whenReady()
    .then(() => {
      extensionsForDevX()

      // * If updated
      const tempData = getDataOfLocation(TEMP_DATA_BEFORE_UPDATE)

      globalShortcut.register('CommandOrControl+Shift+X', handleToggleMainWindow)

      createTray()

      return tempData
    })
    .then((d) => createAllWindows(d))
    .then(() => setupUpdateService())
    .catch(console.error)

  app.on('activate', () => {
    const mexRef = windowManager.getWindow(AppType.MEX)
    const spotlightRef = windowManager.getWindow(AppType.SPOTLIGHT)

    if (!mexRef) createMexWindow()
    if (!spotlightRef) createSpotLighWindow()

    app?.show()
    mexRef?.show()
    mexRef?.focus()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.once('before-quit', () => {
    windowManager.sendToWindow(AppType.MEX, IpcAction.SAVE_AND_EXIT)
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

  app.on('open-url', function(event, url) {
    event.preventDefault()

    getRedirectPath(windowManager.getWindow(AppType.MEX), url)
  })
}

export default appEventListeners
