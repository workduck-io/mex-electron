import { ipcRenderer } from 'electron'
import { IpcAction } from '../../../data/IpcAction'
import getAnalytics from '../../../services/analytics'
import { CustomEvents } from '../../../services/analytics/events'
import { LoggerType } from './types'

const rendererErrorHandler = (logger: LoggerType) => {
  const { trackEvent } = getAnalytics()

  ipcRenderer.on(IpcAction.ERROR_OCCURED, (_event: Electron.IpcRendererEvent, args: any) => {
    trackEvent(`Main Process - ${CustomEvents.ERROR_OCCURED}`, args)
  })

  window.onerror = (message, source, lineno, colno, error) => {
    const isSuppressedError = error.message.includes('Cannot resolve a Slate node')

    let errorMessage = error.message
    if (isSuppressedError) errorMessage = null

    logger(errorMessage, {
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
