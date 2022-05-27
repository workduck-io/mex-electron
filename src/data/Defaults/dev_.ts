import config from '../../config.json'

export const IS_DEV = process.env.NODE_ENV === 'development'
export const USE_API = !config.constants.USE_API

export const FAKE_APP_URI = 'https://localhost'
export const SENTRY_DSN = 'https://7d6179309e324d8bb08f0aeeb89a6774@o1087208.ingest.sentry.io/6100082'
