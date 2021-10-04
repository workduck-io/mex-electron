import { Auth } from '@aws-amplify/auth'

/**
 * - Email
 * - Password
 */
export interface SignInRequest {
  email: string
  password: string
}

/**
 * - Email
 * - Password
 * - Username (same as email)
 */
export interface SignUpRequest {
  email: string
  password: string
  username: string
}

/**
 * - Username (same as email)
 * - Code
 */
export interface ConfirmSignUpRequest {
  username: string
  code: string
}

export async function signIn (request: SignInRequest): Promise<any> {
  const user = await Auth.signIn(request.email, request.password)
  return user.getSignInUserSession()
}
