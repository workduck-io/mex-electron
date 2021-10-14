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
}

/**
 * - Username (same as email)
 * - Code
 */
export interface ConfirmSignUpRequest {
  email: string
  code: string
}

export async function signIn (request: SignInRequest): Promise<any> {
  const user = await Auth.signIn(request.email, request.password)
  return user.getSignInUserSession()
}

export async function signUp (request: SignUpRequest) {
  await Auth.signUp({
    attributes: {
      email: request.email
    },
    username: request.email,
    password: request.password
  })
}

export async function confirmSignUp (request: ConfirmSignUpRequest) {
  await Auth.confirmSignUp(request.email, request.code)
}

export async function signOut () {
  try {
    await Auth.signOut()
  } catch (error) {
    console.log('error signing out: ', error)
  }
}
