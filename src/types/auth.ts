export interface AuthToken {
  accessToken: string
  idToken: string
}

export interface GoogleAuthTokens {
  calendar?: AuthToken
}

export interface AuthTokenData {
  googleAuth?: GoogleAuthTokens
}
