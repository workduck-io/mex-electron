import * as Sentry from '@sentry/electron'
import { SENTRY_DSN, IS_DEV } from '../../data/Defaults/dev_'

export const initializeSentry = () => {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: IS_DEV ? 'dev' : 'production',
    logLevel: 1,
    ignoreErrors: ['Warning', 'ResizeObserver']
  })
}
