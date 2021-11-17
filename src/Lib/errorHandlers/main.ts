import process from 'process'
import { LoggerType } from './types'

const mainErrorHandler = (logger: LoggerType) => {
  process.on('uncaughtException', (error: Error, stack: string) => {
    logger(error.message, { 'mex-error': error, 'mex-stack': stack })
  })

  process.on('unhandledRejection', (reason: Error | any, promise: Promise<any>) => {
    logger(reason, { 'mex-reason': reason })
  })
}

export { mainErrorHandler }
