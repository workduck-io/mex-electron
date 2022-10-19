import * as Sentry from '@sentry/electron'
import { CaptureConsole } from '@sentry/integrations'

import { SENTRY_DSN, IS_DEV } from '../../data/Defaults/dev_'

export const initializeSentry = () => {
  if (!IS_DEV) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: 'production',
      logLevel: 1,
      ignoreErrors: ['ResizeObserver'],
      integrations: [new CaptureConsole({ levels: ['error'] })]
    })
  }
}
