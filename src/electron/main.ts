/* eslint-disable @typescript-eslint/no-var-requires */

/* eslint-disable @typescript-eslint/no-unused-vars */
import { app } from 'electron'
import 'threads/register'

import { initializeSentry } from '../services/sentry'
import appEventListeners from './listeners/app'
import handleIPCListener from './listeners/ipc'

if (process.env.MODE === 'production' || process.env.FORCE_PRODUCTION) {
  initializeSentry()
}

// On windows doesn't work without disabling HW Acceleration
if (process.platform === 'win32') {
  app.disableHardwareAcceleration()
}

if (process.env.MODE === 'production' || process.env.FORCE_PRODUCTION) {
  const sourceMapSupport = require('source-map-support')
  sourceMapSupport.install()
}

appEventListeners()
handleIPCListener()
