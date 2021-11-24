export const IS_DEV = process.env.NODE_ENV === 'development'
// Change USE_API explicitly for testing/using api
export const USE_API = !IS_DEV
export const FAKE_APP_URI = 'https://localhost'
