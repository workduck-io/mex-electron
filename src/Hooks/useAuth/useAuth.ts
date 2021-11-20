import { client, useAuth } from '@workduck-io/dwindle'
import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import useAnalytics from '../../analytics'
import { CustomEvents, Properties } from '../../analytics/events'
import { useUpdater } from '../../Data/useUpdater'
import { apiURLs } from '../../Requests/routes'
import { useApi } from '../../Requests/Save'
import { RegisterFormData } from '../../Views/Register'

interface UserDetails {
  email: string
}

interface WorkspaceDetails {
  name: string
  id: string
}

interface AuthStoreState extends State {
  authenticated: boolean
  registered: boolean
  userDetails: undefined | UserDetails
  workspaceDetails: undefined | WorkspaceDetails
  setAuthenticated: (userDetails: UserDetails, workspaceDetails: WorkspaceDetails) => void
  // setAuthenticatedUserDetails: (userDetails: UserDetails) => void
  setUnAuthenticated: () => void
  setRegistered: (val: boolean) => void
  getWorkspaceId: () => string | undefined
}

export const useAuthStore = create<AuthStoreState>(
  persist(
    (set, get) => ({
      authenticated: false,
      registered: false,
      userDetails: undefined,
      workspaceDetails: undefined,
      setAuthenticated: (userDetails, workspaceDetails) =>
        set({ authenticated: true, userDetails, workspaceDetails, registered: false }),
      // setAuthenticatedUserDetails: (userDetails: UserDetails) => set({ authenticated: true, userDetails }),
      setUnAuthenticated: () => set({ authenticated: false, userDetails: undefined, workspaceDetails: undefined }),
      setRegistered: (val) => set({ registered: val }),
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
  const { signIn, signUp, verifySignUp, signOut } = useAuth()
  const { identifyUser, addUserProperties, addEventProperties } = useAnalytics()
  const { getNodesByWorkspace } = useApi()

  const login = async (
    email: string,
    password: string,
    getWorkspace = false
  ): Promise<{ data: UserCred; v: string }> => {
    let data: any // eslint-disable-line @typescript-eslint/no-explicit-any
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
      await client
        .get(apiURLs.getUserRecords(data.userId))
        .then((d) => {
          // console.log('workspace data', d.data)
          // Set Authenticated, user and workspace details
          getNodesByWorkspace(d.data.group).then((d) => console.log('NODES: ', d))
          setAuthenticated({ email }, { id: d.data.group, name: 'WORKSPACE_NAME' })
          identifyUser(email)
          addUserProperties({
            [Properties.EMAIL]: email,
            [Properties.NAME]: d.data.metadata.name,
            [Properties.ROLE]: d.data.metadata.roles,
            [Properties.WORKSPACE_ID]: d.data.group
          })
          addEventProperties({ [CustomEvents.LOGGED_IN]: true })
        })
        .then(updateDefaultServices)
        .then(updateServices)
        .then()
        .catch((e) => {
          console.error({ e })
          return e.toString() as string
        })
    }

    return { data, v }
  }

  const registerDetails = (data: RegisterFormData): Promise<string> => {
    // tag: mex
    const status = signUp(data.email, data.password)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verifySignup = async (code: string, metadata: any): Promise<string> => {
    const formMetaData = {
      ...metadata,
      name: sensitiveData.name,
      email: sensitiveData.email,
      roles: sensitiveData.roles.reduce((prev, cur) => `${prev},${cur.value}`, '').slice(1)
    }
    const vSign = await verifySignUp(code, formMetaData).catch(console.error)
    // console.log({ vSign })

    const loginData = await login(sensitiveData.email, sensitiveData.password).catch(console.error)

    if (!loginData) {
      return
    }

    const uCred = loginData.data
    const newWorkspaceName = `WD_${nanoid()}`

    await client
      .post(apiURLs.registerUser, {
        user: {
          id: uCred.userId,
          name: uCred.email,
          email: uCred.email
        },
        workspaceName: newWorkspaceName
      })
      .then((d) => {
        // console.log(d.data)
        // Set workspace details
        setAuthenticated({ email: sensitiveData.email }, { id: d.data.id, name: d.data.name })
      })
      .then(updateDefaultServices)
      .then(updateServices)
      .catch(console.error)

    if (vSign) {
      setRegistered(false)
    }
    return vSign
  }

  const logout = () => {
    signOut().then(() => setUnAuthenticated())
  }

  return { login, registerDetails, logout, verifySignup }
}
