import { ipcRenderer } from 'electron'
import { IpcAction } from '../../Spotlight/utils/constants'
import getAnalytics from '../../analytics'
import { CustomEvents } from '../../analytics/events'
import { LoggerType } from './types'

const rendererErrorHandler = (logger: LoggerType) => {
  const { trackEvent } = getAnalytics()

  ipcRenderer.on(IpcAction.ERROR_OCCURED, (_event: Electron.IpcRendererEvent, args: any) => {
    trackEvent(`Main Process - ${CustomEvents.ERROR_OCCURED}`, args)
  })

  window.onerror = (message, source, lineno, colno, error) => {
    logger(error.message, {
      'mex-error': error,
      'mex-source': source,
      'mex-message': message,
      'mex-line-number': lineno,
      'mex-column-number': colno
    })
    return true
  }

  window.onunhandledrejection = (event) => {
    event.preventDefault()
    logger(event.reason, { 'mex-reason': event.reason })
  }
}

export { rendererErrorHandler }
