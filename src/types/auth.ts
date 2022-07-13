export interface UserDetails {
  email: string
  userID: string
  name: string
  alias: string
}

export interface UpdatableUserDetails {
  name?: string
  alias?: string
}

export interface AuthToken {
  accessToken: string
  idToken: string
  refreshToken: string
}

export interface GoogleAuthTokens {
  calendar?: AuthToken
}

export interface AuthTokenData {
  googleAuth?: GoogleAuthTokens
}

// Note that there are more fields, only required ones are listed here
export interface GoogleOAuthTokenData {
  email: string
  email_verified: boolean
  exp: number
}
