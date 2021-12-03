import { SENTRY_DSN } from './Defaults/dev_'
import * as Sentry from '@sentry/electron'

export const initializeSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN
  })
  console.log('Sentry Initialized!')
}
