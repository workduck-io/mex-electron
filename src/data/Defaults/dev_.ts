import { mog } from '../../utils/lib/helper'
import useOnboard from '../../store/useOnboarding'

export const IS_DEV = process.env.NODE_ENV === 'development'
export const USE_API = () => {
  const isOnboarding = useOnboard.getState().isOnboarding

  mog('USE API', { api: true && !isOnboarding })

  /** Useful for tracking stopped API calls */
  // if (IS_DEV) console.info('API is set to false')
  return !IS_DEV && !isOnboarding
}
export const FAKE_APP_URI = 'https://localhost'
export const SENTRY_DSN = 'https://7d6179309e324d8bb08f0aeeb89a6774@o1087208.ingest.sentry.io/6100082'
