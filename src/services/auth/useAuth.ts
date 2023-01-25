import { useState } from 'react'

// import { useApi } from '../../apis/useSaveApi'
import { useActionsPerfomerClient } from '@components/spotlight/Actions/useActionPerformer'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
// import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'
import { getEmailStart, MEX_TAG } from '@data/Defaults/auth'
import useDataStore from '@store/useDataStore'
import { useHelpStore } from '@store/useHelpStore'
import { useLayoutStore } from '@store/useLayoutStore'
import { useRecentsStore } from '@store/useRecentsStore'
import useTodoStore from '@store/useTodoStore'
import { useUserCacheStore } from '@store/useUserCacheStore'
import { mog } from '@utils/lib/mog'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import toast from 'react-hot-toast'
import create, { State } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { client, useAuth } from '@workduck-io/dwindle'
import { UserCred } from '@workduck-io/mex-utils'

import { apiURLs } from '../../apis/routes'
import useActions from '../../components/spotlight/Actions/useActions'
import { UpdatableUserDetails, UserDetails } from '../../types/auth'
import { RegisterFormData } from '../../views/mex/Register'
import useAnalytics from '../analytics'
import { CustomEvents, Properties } from '../analytics/events'
import { useTokenStore } from './useTokens'

interface WorkspaceDetails {
  name: string
  id: string
}

interface AuthStoreState extends State {
  isForgottenPassword: boolean
  authenticated: boolean
  registered: boolean
  userDetails: undefined | UserDetails
  workspaceDetails: undefined | WorkspaceDetails
  setAuthenticated: (userDetails: UserDetails, workspaceDetails: WorkspaceDetails) => void
  setUnAuthenticated: () => void
  setRegistered: (val: boolean) => void
  setIsForgottenPassword: (val: boolean) => void
  getWorkspaceId: () => string | undefined
  updateUserDetails: (userDetails: UpdatableUserDetails) => void
}

export const useAuthStore = create<AuthStoreState>(
  devtools(
    persist(
      (set, get) => ({
        isForgottenPassword: false,
        authenticated: false,
        registered: false,
        userDetails: undefined,
        workspaceDetails: undefined,
        setAuthenticated: (userDetails, workspaceDetails) =>
          set({ authenticated: true, userDetails, workspaceDetails, registered: false }),
        // setAuthenticatedUserDetails: (userDetails: UserDetails) => set({ authenticated: true, userDetails }),
        setUnAuthenticated: () => set({ authenticated: false, userDetails: undefined, workspaceDetails: undefined }),
        setRegistered: (val) => set({ registered: val }),
        setIsForgottenPassword: (val) => set({ isForgottenPassword: val }),
        getWorkspaceId: () => {
          const workspaceDetails = get().workspaceDetails
          if (workspaceDetails) {
            return workspaceDetails.id
          }
          return undefined
        },
        updateUserDetails: (userDetails) => {
          set({ userDetails: { ...get().userDetails, ...userDetails } })
        }
      }),
      { name: 'auth-mex' }
    )
  )
)

type LoginResult = { loginData: UserCred; loginStatus: string }

export const useAuthentication = () => {
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const clearActionCache = useActionsCache((store) => store.clearActionCache)
  const resetDataStore = useDataStore((s) => s.resetDataStore)
  const { signIn, signUp, verifySignUp, signOut, googleSignIn } = useAuth()
  const { addEventProperties } = useAnalytics()
  const { clearActionStore } = useActions()
  const clearRecents = useRecentsStore((store) => store.clear)
  const clearTodos = useTodoStore((s) => s.clearTodos)

  const { goTo } = useRouting()
  const clearShortcuts = useHelpStore((store) => store.clearShortcuts)
  const removeGoogleCalendarToken = useTokenStore((store) => store.removeGoogleCalendarToken)

  const login = async (email: string, password: string): Promise<LoginResult> => {
    const loginResult = await signIn(email, password)
      .then((d) => {
        return { loginStatus: 'success', loginData: d }
      })
      .catch((e) => {
        console.error({ e })
        return { loginStatus: e.toString(), loginData: {} as UserCred }
      })

    return loginResult
  }

  const loginViaGoogle = async (code: string, clientId: string, redirectURI: string): Promise<LoginResult> => {
    try {
      const loginResult = await googleSignIn(code, clientId, redirectURI)
        .then(({ userCred }: { userCred: UserCred }) => {
          return { loginStatus: 'success', loginData: userCred }
        })
        .catch((e: Error) => {
          console.error('GoogleLoginError', { error: e })
          return { loginStatus: e.toString(), loginData: {} as UserCred }
        })

      return loginResult
    } catch (error) {
      mog('ErrorInGoogleLogin', { error })
    }
  }

  const registerDetails = (data: RegisterFormData): Promise<any> => {
    const customAttributes = [{ name: 'user_type', value: MEX_TAG }]
    const { email, password } = data

    const status = signUp(email, password, customAttributes)
      .then(() => {
        setRegistered(true)
        setSensitiveData(data)
        return data.email
      })
      .catch((e) => {
        if (e.name === 'UsernameExistsException') {
          setRegistered(true)
          setSensitiveData(data)
          return e.name
        }
      })
    return status
  }

  const verifySignup = async (code: string, metadata: any): Promise<any> => {
    const formMetadata = {
      ...metadata,
      name: sensitiveData.name,
      email: sensitiveData.email,
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1),
      alias: sensitiveData.alias
    }
    await verifySignUp(code, formMetadata).catch(console.error)
    const { loginStatus, loginData } = await login(sensitiveData.email, sensitiveData.password)

    if (loginStatus !== 'success') throw new Error('Could Not Verify Signup')

    return loginData
  }

  const logout = () => {
    try {
      signOut()
    } catch (err) {
      mog('Unable to logout')
    } finally {
      setUnAuthenticated()
      clearActionStore()
      clearActionCache()
      clearShortcuts()
      clearRecents()
      clearTodos()
      resetDataStore()
      removeGoogleCalendarToken()

      addEventProperties({ [CustomEvents.LOGGED_IN]: false })

      localStorage.clear()

      // ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: false })
      goTo(ROUTE_PATHS.login, NavigationType.push)
    }
  }

  const registerNewUser = async (loginResult: UserCred) => {
    const { email, userId } = loginResult
    const name = getEmailStart(email)

    let workspaceID = null
    for (let i = 0; i < 7; i++) {
      try {
        const result = await client.get(apiURLs.user.registerStatus)
        if (result.status === 200) {
          workspaceID = result.data.workspaceID
          break
        }
      } catch (error) {
        await new Promise((resolve) => setTimeout(resolve, 2 * 1000))
      }
    }

    if (!workspaceID) {
      toast('Could not sign-up new user')
      throw new Error('Did not receive status SUCCESS from backend; Could not signup')
    }
    const userDetails = {
      email: email,
      alias: name,
      userID: userId,
      name: name
    }
    const workspaceDetails = { id: workspaceID, name: 'WORKSPACE_NAME' }

    return { userDetails, workspaceDetails }
  }

  return { login, registerDetails, logout, verifySignup, loginViaGoogle, registerNewUser }
}

export const useInitializeAfterAuth = () => {
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const addUser = useUserCacheStore((s) => s.addUser)

  const { identifyUser, addUserProperties, addEventProperties } = useAnalytics()

  const { refreshToken } = useAuth()
  const { registerNewUser } = useAuthentication()
  const { initActionPerfomerClient } = useActionsPerfomerClient()

  const initializeAfterAuth = async (
    loginData: UserCred,
    forceRefreshToken = false,
    isGoogle = false,
    registerUser = false,
    roles?: string
  ) => {
    try {
      const { userDetails, workspaceDetails } = registerUser
        ? await registerNewUser(loginData)
        : await client
            .get(apiURLs.user.getUserRecords)
            .then(async (res) => {
              if (res) {
                if (isGoogle && res.data.group === undefined) {
                  forceRefreshToken = true
                  return await registerNewUser(loginData)
                } else if (res.data.group) {
                  const userDetails = {
                    email: loginData.email,
                    alias: res.data.alias ?? res.data.properties?.alias ?? res.data.name,
                    userID: res.data.id,
                    name: res.data.name,
                    roles: res.data?.metadata?.roles ?? ''
                  }
                  const workspaceDetails = { id: res.data.group, name: 'WORKSPACE_NAME' }
                  return { workspaceDetails, userDetails }
                } else {
                  throw new Error('Could Not Fetch User Records')
                }
              }
            })
            .catch((error) => {
              if (error.status === 404) {
                return registerNewUser(loginData)
              }
            })

      identifyUser(userDetails.email)
      initActionPerfomerClient(userDetails.userID)
      addUser({
        userID: userDetails.userID,
        email: userDetails.email,
        name: userDetails.name,
        alias: userDetails.alias
      })

      addUserProperties({
        [Properties.EMAIL]: userDetails.email,
        [Properties.NAME]: userDetails.name,
        [Properties.ROLE]: registerUser ? roles : (userDetails as any)?.roles,
        [Properties.WORKSPACE_ID]: workspaceDetails.id,
        [Properties.ALIAS]: userDetails.alias
      })
      addEventProperties({ [CustomEvents.LOGGED_IN]: true })

      if (forceRefreshToken) await refreshToken()
      setAuthenticated(userDetails, workspaceDetails)
      setShowLoader(true)
    } catch (error) {
      mog('InitializeAfterAuthError', { error })
    } finally {
      // Loader would be stopped inside useInitLoader
      // setShowLoader(false)
    }
  }

  return { initializeAfterAuth }
}
