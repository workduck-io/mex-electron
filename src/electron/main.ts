/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from 'electron'

import { initializeSentry } from '../services/sentry'
import appEventListeners, { WindowsType } from './listeners/app'
import handleIPCListener from './listeners/ipc'

if (process.env.NODE_ENV === 'production' || process.env.FORCE_PRODUCTION) {
  initializeSentry()
}

// On windows doesn't work without disabling HW Acceleration
if (process.platform === 'win32') {
  app.disableHardwareAcceleration()
}

if (require('electron-squirrel-startup')) {
  app.quit()
}

export const windows: WindowsType = { mex: null, spotlight: null, toast: null }

if (process.env.NODE_ENV === 'production' || process.env.FORCE_PRODUCTION) {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

appEventListeners()
handleIPCListener()
