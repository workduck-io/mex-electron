import { useState } from 'react'

// import { useApi } from '../../apis/useSaveApi'
import { useActionsPerfomerClient } from '@components/spotlight/Actions/useActionPerformer'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { useHelpStore } from '@store/useHelpStore'
import { useLayoutStore } from '@store/useLayoutStore'
import { useRecentsStore } from '@store/useRecentsStore'
import { useUserCacheStore } from '@store/useUserCacheStore'
import { NavigationType, ROUTE_PATHS, useRouting } from '@views/routes/urls'
import { nanoid } from 'nanoid'
import toast from 'react-hot-toast'
import create, { State } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { client, useAuth } from '@workduck-io/dwindle'

import { apiURLs } from '../../apis/routes'
import useActions from '../../components/spotlight/Actions/useActions'
import { UpdatableUserDetails, UserDetails } from '../../types/auth'
import { mog } from '../../utils/lib/helper'
import type { RegisterFormData } from '../../views/mex/Register'
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

interface AuthDetails {
  userDetails: UserDetails
  workspaceDetails: WorkspaceDetails
}

export const useAuthentication = () => {
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const clearActionCache = useActionsCache((store) => store.clearActionCache)
  const { signIn, signUp, verifySignUp, signOut, googleSignIn, refreshToken } = useAuth()
  const { identifyUser, addUserProperties, addEventProperties } = useAnalytics()
  const addUser = useUserCacheStore((s) => s.addUser)
  const { clearActionStore } = useActions()
  const { initActionPerfomerClient } = useActionsPerfomerClient()
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  const clearRecents = useRecentsStore((store) => store.clear)

  const { goTo } = useRouting()
  const clearShortcuts = useHelpStore((store) => store.clearShortcuts)
  const removeGoogleCalendarToken = useTokenStore((store) => store.removeGoogleCalendarToken)
  const login = async (
    email: string,
    password: string,
    getWorkspace = false
  ): Promise<{ data: any; v: string; authDetails: AuthDetails }> => {
    let data: any // eslint-disable-line @typescript-eslint/no-explicit-any
    let authDetails: any // eslint-disable-line @typescript-eslint/no-explicit-any
    const v = await signIn(email, password)
      .then((d) => {
        data = d
        return 'success'
      })
      .catch((e) => {
        console.error({ e })
        return e.toString() as string
      })

    if (getWorkspace && data !== undefined) {
      authDetails = await client
        .get(apiURLs.getUserRecords)
        .then(async (d) => {
          const userDetails = { email, alias: d.data.alias ?? d.data.name, userID: d.data.id, name: d.data.name }
          mog('DATA AFTER LOGGING IN', { d })
          const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }
          initActionPerfomerClient(userDetails?.userID)
          mog('UserDetails', { userDetails, d, data: d.data })
          userDetails['name'] = d.data.metadata.name

          // * For Heap analytics
          identifyUser(email)
          addUserProperties({
            [Properties.EMAIL]: email,
            [Properties.NAME]: d.data.metadata.name,
            [Properties.ROLE]: d.data.metadata.roles,
            [Properties.WORKSPACE_ID]: d.data.group,
            [Properties.ALIAS]: d.data.metadata.alias
          })

          addEventProperties({ [CustomEvents.LOGGED_IN]: true })

          addUser({
            userID: userDetails.userID,
            email: userDetails.email,
            name: userDetails.name,
            alias: userDetails.alias
          })
          return { userDetails, workspaceDetails }
        })
        // .then(updateDefaultServices)
        // .then(updateServices)
        // .then()
        .catch((e) => {
          console.error({ e })
          setShowLoader(false)
          return e.toString() as string
        })
    }

    return { data, v, authDetails }
  }

  /*
   * Login via google
   */
  const loginViaGoogle = async (code: string, clientId: string, redirectURI: string, getWorkspace = true) => {
    // TODO: Fix for alias
    try {
      const result: any = await googleSignIn(code, clientId, redirectURI)
      if (getWorkspace && result !== undefined) {
        await client
          .get(apiURLs.getUserRecords)
          /*
           * If the user is present in the database, then we will add properties
           */
          .then(async (d: any) => {
            /**
             * If workspaceId is not present then we calling the register endpoint of the backend
             */
            const userDetails = {
              email: result.userCred.email,
              userID: result.userCred.userId,
              alias: d.data.alias ?? d.data.name,
              name: d.data.name
            }
            initActionPerfomerClient(userDetails.userID)
            if (!d.data.group) {
              await registerUserForGoogle(result, d.data)
            } else {
              /**
               * Else we will add properties
               */
              mog('UserDetails', { userDetails: result })
              const userDetails = {
                email: result.userCred.email,
                name: d.data.name,
                userID: result.userCred.userId,
                alias: d.data.alias ?? d.data.name
              }
              const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }
              initActionPerfomerClient(userDetails.userID)

              identifyUser(userDetails.email)
              mog('Login Google BIG success', { d, userDetails, workspaceDetails })
              addUserProperties({
                [Properties.EMAIL]: userDetails.email,
                [Properties.NAME]: userDetails.name,
                [Properties.ALIAS]: d.data.alias,
                [Properties.ROLE]: '',
                [Properties.WORKSPACE_ID]: d.data.group
              })
              addEventProperties({ [CustomEvents.LOGGED_IN]: true })

              setAuthenticated(userDetails, workspaceDetails)
            }
          })
      }
    } catch (error) {
      console.log(error)
      setShowLoader(false)
    }
  }

  async function registerUserForGoogle(result: any, data: any) {
    mog('Registering user for google', { result })
    setSensitiveData({ email: result.email, name: data.name, password: '', roles: [], alias: data.alias ?? data.name })
    const uCred: any = {
      username: result.userCred.username,
      email: result.userCred.email,
      userId: result.userCred.userId,
      expiry: result.userCred.expiry,
      token: result.userCred.token,
      url: result.userCred.url
    }

    const newWorkspaceName = `WD_${nanoid()}`

    mog('Login Google Need to create user', { uCred })
    // console.error('catch', { e })
    await client
      .post(
        apiURLs.registerUser,
        {
          type: 'RegisterUserRequest',
          user: {
            id: uCred.userId,
            name: data.name,
            alias: data.alias ?? data.name,
            email: uCred.email
          },
          workspaceName: newWorkspaceName
        },
        {
          headers: {
            'mex-workspace-id': ''
          }
        }
      )
      .then(async (d: any) => {
        try {
          await refreshToken()
        } catch (error) {
          // setShowLoader(false)
          mog('Error: ', { error: JSON.stringify(error) })
        }
        const userDetails = {
          userID: uCred.userId,
          name: data.name,
          alias: data.alias ?? data.name,
          email: uCred.email
        }
        const workspaceDetails = { id: d.data.id, name: 'WORKSPACE_NAME' }
        mog('Register Google BIG success', { d, data, userDetails, workspaceDetails })

        initActionPerfomerClient(userDetails.userID)

        identifyUser(userDetails.email)
        mog('Login Google BIG success created user', { userDetails, workspaceDetails })
        addUserProperties({
          [Properties.EMAIL]: userDetails.email,
          [Properties.NAME]: userDetails.name,
          [Properties.ALIAS]: userDetails.alias,
          [Properties.ROLE]: '',
          [Properties.WORKSPACE_ID]: d.data.group
        })
        addEventProperties({ [CustomEvents.LOGGED_IN]: true })
        setAuthenticated(userDetails, workspaceDetails)
      })
      .catch((err) => {
        toast('Registeration failed')
        setShowLoader(false)
      })
  }

  const registerDetails = (data: RegisterFormData): Promise<string> => {
    const { email, password, roles, name, alias } = data
    const userRole = roles.map((r) => r.value).join(', ') ?? ''

    const status = signUp(email, password)
      .then(() => {
        setRegistered(true)
        // * Identify user
        identifyUser(email)

        // * Add extra user related properties
        addUserProperties({
          [Properties.EMAIL]: email,
          [Properties.NAME]: name,
          [Properties.ALIAS]: alias,
          [Properties.ROLE]: userRole
        })
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verifySignup = async (code: string, metadata: any): Promise<string> => {
    const formMetaData = {
      ...metadata,
      name: sensitiveData.name,
      alias: sensitiveData.alias,
      email: sensitiveData.email,
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1)
    }
    setShowLoader(true)

    const vSign = await verifySignUp(code, formMetaData).catch(console.error)
    console.log({ vSign })

    const loginData = await login(sensitiveData.email, sensitiveData.password).catch(console.error)

    if (!loginData) {
      return
    }

    const uCred = loginData.data
    const newWorkspaceName = `WD_${nanoid()}`

    await client
      .post(
        apiURLs.registerUser,
        {
          type: 'RegisterUserRequest',
          user: {
            id: uCred.userId,
            name: sensitiveData.name,
            email: uCred.email,
            alias: sensitiveData.alias
          },
          workspaceName: newWorkspaceName
        },
        {
          headers: {
            'mex-workspace-id': ''
          }
        }
      )
      .then(async (d: any) => {
        try {
          await refreshToken()
        } catch (error) {
          // setShowLoader(false)
          mog('Error: ', { error: JSON.stringify(error) })
        }

        const userDetails = {
          email: uCred.email,
          userID: uCred.userId,
          name: sensitiveData.name,
          alias: sensitiveData.alias
        }
        initActionPerfomerClient(userDetails?.userID)

        addUser({
          userID: userDetails.userID,
          email: userDetails.email,
          name: userDetails.name,
          alias: userDetails.alias
        })
        setAuthenticated(userDetails, { id: d.data.id, name: d.data.name })
      })
      .catch((err) => {
        setShowLoader(false)
        mog('Error: ', { error: 'Unable to create workspace' })
      })

    if (vSign) {
      setRegistered(false)
    }
    return vSign
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
      removeGoogleCalendarToken()

      addEventProperties({ [CustomEvents.LOGGED_IN]: false })

      localStorage.clear()

      // ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: false })
      goTo(ROUTE_PATHS.login, NavigationType.push)
    }
  }

  return { login, registerDetails, logout, verifySignup, loginViaGoogle }
}
