import { CustomEvents } from '../../analytics/events'
import getAnalytics from '../../analytics'
import { rendererErrorHandler } from './renderer'
import { IS_DEV } from '../../Defaults/dev_'
import { dialog, ipcRenderer } from 'electron'
import { IpcAction } from '../../Spotlight/utils/constants'
import { debounce } from 'lodash'
import { mainErrorHandler } from './main'

export const showDialog = (message: string, properties: Record<string, any>) => {
  if (process.type === 'renderer') ipcRenderer.send(IpcAction.ERROR_OCCURED, { message, properties })
  else {
    dialog.showMessageBoxSync({
      title: 'Oh Snap! An error occured in Mex',
      message: 'Something went wrong',
      buttons: ['Report'],
      defaultId: 0
    })
  }
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
