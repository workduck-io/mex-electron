import { useAuth, client } from '@workduck-io/dwindle'
import { nanoid } from 'nanoid'
import { apiURLs } from '../../Requests/routes'
import create, { State } from 'zustand'
import { persist } from 'zustand/middleware'
import { useUpdater } from '../../Data/useUpdater'
import { useState } from 'react'
import { UserCred } from '@workduck-io/dwindle/lib/esm/AuthStore/useAuthStore'

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
  const [sensitiveData, setSensitiveData] = useState({ email: '', word: '' })
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const { updateDefaultServices, updateServices } = useUpdater()
  const { signIn, signUp, verifySignUp, signOut } = useAuth()

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
          setAuthenticated({ email }, { id: d.data.id, name: d.data.name })
        })
        .then(updateDefaultServices)
        .then(updateServices)
        .catch((e) => {
          console.error({ e })
          return e.toString() as string
        })
    }

    return { data, v }
  }

  const registerDetails = (email: string, password: string): Promise<string> => {
    // tag: mex
    const status = signUp(email, password)
      .then(() => {
        setRegistered(true)
        setSensitiveData({ email, word: password })
        return email
      })
      .catch((e) => {
        if (e.name === 'UsernameExistsException') {
          setRegistered(true)
          setSensitiveData({ email, word: password })
          return e.name
        }
      })
    return status
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const verifySignup = async (code: string, metadata: any): Promise<string> => {
    const vSign = await verifySignUp(code, metadata).catch(console.error)
    console.log({ vSign })

    const loginData = await login(sensitiveData.email, sensitiveData.word).catch(console.error)

    if (!loginData) {
      return
    }

    const uCred = loginData.data
    const newWorkspaceName = `WD_${nanoid()}`

    const workspace_details = await client
      .post(apiURLs.registerUser, {
        user: {
          id: uCred.userId,
          name: uCred.email,
          email: uCred.email
        },
        workspaceName: newWorkspaceName
      })
      .then((d) => {
        console.log(d.data)
        // Set workspace details
        setAuthenticated({ email: sensitiveData.email }, { id: d.data.id, name: d.data.name })
      })
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
