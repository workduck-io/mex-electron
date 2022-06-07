import { client, useAuth } from '@workduck-io/dwindle'
import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'
import { ipcRenderer } from 'electron'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { apiURLs } from '../../apis/routes'
// import { useApi } from '../../apis/useSaveApi'
import { IpcAction } from '../../data/IpcAction'
import { useUpdater } from '../../hooks/useUpdater'
import { RegisterFormData } from '../../views/mex/Register'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import useAnalytics from '../analytics'
import { Properties, CustomEvents } from '../analytics/events'
import { mog } from '../../utils/lib/helper'
import useActions from '../../components/spotlight/Actions/useActions'
import { useActionsPerfomerClient } from '@components/spotlight/Actions/useActionPerformer'
import { useActionsCache } from '@components/spotlight/Actions/useActionsCache'
import { useLayoutStore } from '@store/useLayoutStore'

interface UserDetails {
  email: string
}

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
}

export const useAuthStore = create<AuthStoreState>(
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
      }
    }),
    { name: 'auth-mex' }
  )
)

export const useAuthentication = () => {
  const [sensitiveData, setSensitiveData] = useState<RegisterFormData | undefined>()
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const { updateDefaultServices, updateServices } = useUpdater()
  const clearActionCache = useActionsCache((store) => store.clearActionCache)
  const { signIn, signUp, verifySignUp, signOut, googleSignIn, refreshToken } = useAuth()
  const { identifyUser, addUserProperties, addEventProperties } = useAnalytics()
  const { clearActionStore, getGroupsToView } = useActions()
  const { initActionPerfomerClient } = useActionsPerfomerClient()
  const setShowLoader = useLayoutStore((store) => store.setShowLoader)
  // const { getNodesByWorkspace } = useApi()

  interface AuthDetails {
    userDetails: UserDetails
    workspaceDetails: WorkspaceDetails
  }

  const login = async (
    email: string,
    password: string,
    getWorkspace = false
  ): Promise<{ data: UserCred; v: string; authDetails: AuthDetails }> => {
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
          const userDetails = { email }
          const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }
          initActionPerfomerClient(workspaceDetails.id)

          setShowLoader(true)
          try {
            await getGroupsToView()
          } catch (err) {
            setShowLoader(false)
            mog('Unable to init action groups into view', { err })
          }

          ipcRenderer.send(IpcAction.LOGGED_IN, { userDetails, workspaceDetails, loggedIn: true })
          // * For Heap analytics
          identifyUser(email)
          addUserProperties({
            [Properties.EMAIL]: email,
            [Properties.NAME]: d.data.metadata.name,
            [Properties.ROLE]: d.data.metadata.roles,
            [Properties.WORKSPACE_ID]: d.data.group
          })
          setShowLoader(false)
          addEventProperties({ [CustomEvents.LOGGED_IN]: true })
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
            setShowLoader(true)
            if (!d.data.group) {
              await registerUserForGoogle(result)
            } else {
              /**
               * Else we will add properties
               */
              const userDetails = { email: result.userCred.email, userId: result.userCred.userId }
              const workspaceDetails = { id: d.data.group, name: 'WORKSPACE_NAME' }
              initActionPerfomerClient(workspaceDetails.id)

              try {
                await getGroupsToView()
              } catch (err) {
                setShowLoader(false)
                mog('Unable to init action groups into view', { err })
              }

              ipcRenderer.send(IpcAction.LOGGED_IN, { userDetails, workspaceDetails, loggedIn: true })
              identifyUser(userDetails.email)
              mog('Login Google BIG success', { d, userDetails, workspaceDetails })
              addUserProperties({
                [Properties.EMAIL]: userDetails.email,
                [Properties.NAME]: userDetails.email,
                [Properties.ROLE]: '',
                [Properties.WORKSPACE_ID]: d.data.group
              })
              addEventProperties({ [CustomEvents.LOGGED_IN]: true })

              setAuthenticated(userDetails, workspaceDetails)
              setShowLoader(false)
            }
          })
      }
    } catch (error) {
      console.log(error)
      setShowLoader(false)
    }
  }

  async function registerUserForGoogle(result: any) {
    setSensitiveData({ email: result.email, name: result.email, password: '', roles: [] })
    const uCred: UserCred = {
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
            name: uCred.email,
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
        const userDetails = { email: uCred.email, userId: uCred.userId }
        const workspaceDetails = { id: d.data.id, name: 'WORKSPACE_NAME' }
        mog('Register Google BIG success', { d, userDetails, workspaceDetails })

        initActionPerfomerClient(workspaceDetails.id)

        try {
          await getGroupsToView()
        } catch (err) {
          mog('Unable to init action groups into view', { err })
        }

        ipcRenderer.send(IpcAction.LOGGED_IN, { userDetails, workspaceDetails, loggedIn: true })
        identifyUser(userDetails.email)
        mog('Login Google BIG success created user', { userDetails, workspaceDetails })
        addUserProperties({
          [Properties.EMAIL]: userDetails.email,
          [Properties.NAME]: userDetails.email,
          [Properties.ROLE]: '',
          [Properties.WORKSPACE_ID]: d.data.group
        })
        addEventProperties({ [CustomEvents.LOGGED_IN]: true })
        setAuthenticated(userDetails, workspaceDetails)
        // setShowLoader(false)
      })
      .catch(console.error)
      .finally(() => {
        setShowLoader(false)
      })
  }

  const registerDetails = (data: RegisterFormData): Promise<string> => {
    const { email, password, roles, name } = data
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
      email: sensitiveData.email,
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1)
    }
    setShowLoader(true)

    const vSign = await verifySignUp(code, formMetaData).catch(console.error)
    // console.log({ vSign })

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
            name: uCred.email,
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
        // console.log(d.data)
        // Set workspace details
        const userDetails = { email: uCred.email }
        const workspaceDetails = { id: newWorkspaceName, name: 'WORKSPACE_NAME' }
        initActionPerfomerClient(newWorkspaceName)

        try {
          await getGroupsToView()
        } catch (err) {
          setShowLoader(false)
          mog('Unable to init action groups into view', { err })
        }

        ipcRenderer.send(IpcAction.LOGGED_IN, { userDetails, workspaceDetails, loggedIn: true })
        setAuthenticated({ email: sensitiveData.email }, { id: d.data.id, name: d.data.name })
        setShowLoader(false)
      })
      .then(updateDefaultServices)
      .then(updateServices)
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
    signOut().then(() => {
      setUnAuthenticated()
      clearActionStore()
      clearActionCache()
      ipcRenderer.send(IpcAction.LOGGED_IN, { loggedIn: false })
    })
  }

  return { login, registerDetails, logout, verifySignup, loginViaGoogle }
}
