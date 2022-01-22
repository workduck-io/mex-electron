import { rendererErrorHandler } from './renderer'
import { ipcRenderer } from 'electron'
import { debounce } from 'lodash'
import { mainErrorHandler } from './main'
import { IpcAction } from '../../../data/IpcAction'
import getAnalytics from '../../../services/analytics'
import { IS_DEV } from '../../../data/Defaults/dev_'
import { CustomEvents } from '../../../services/analytics/events'

export const showDialog = (message: string, properties: Record<string, any>) => {
  if (process.type === 'renderer') ipcRenderer.send(IpcAction.ERROR_OCCURED, { message, properties })
}

const logger = debounce((message: string | null, properties: Record<string, any>) => {
  const { trackEvent } = getAnalytics()

  if (!IS_DEV) {
    if (message) showDialog(message, properties)
    trackEvent(`Mex - ${CustomEvents.ERROR_OCCURED}`, properties)
  } else {
    console.log(message, properties)
  }
}, 200)

const initErrorHandler = () => {
  if (process.type === 'renderer') {
    rendererErrorHandler(logger)
  } else {
    mainErrorHandler(logger)
  }
}

export default initErrorHandler
