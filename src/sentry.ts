import { SENTRY_DSN, IS_DEV } from './Defaults/dev_'
import * as Sentry from '@sentry/electron'

export const initializeSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: IS_DEV ? 'dev' : 'production'
  })
  console.log('Sentry Initialized!')
}
