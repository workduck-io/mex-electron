import { useAuth, client } from '@workduck-io/dwindle'
import { nanoid } from 'nanoid'
import { apiURLs } from '../../Requests/routes'
import create from 'zustand'
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

interface AuthStoreState {
  authenticated: boolean
  registered: boolean
  userDetails: undefined | UserDetails
  workspaceDetails: undefined | WorkspaceDetails
  setAuthenticated: (userDetails: UserDetails) => void
  setUnAuthenticated: () => void
  setRegistered: (val: boolean) => void
  setWorkspaceDetails: (workspaceDetails: WorkspaceDetails) => void
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  authenticated: true,
  registered: false,
  userDetails: undefined,
  workspaceDetails: undefined,
  setAuthenticated: (userDetails) => set({ authenticated: true, userDetails }),
  setUnAuthenticated: () => set({ authenticated: false, userDetails: undefined, workspaceDetails: undefined }),
  setRegistered: (val) => set({ registered: val }),
  setWorkspaceDetails: (workspaceDetails: WorkspaceDetails) => set({ workspaceDetails })
}))

export const useAuthentication = () => {
  const [sensitiveData, setSensitiveData] = useState({ email: '', word: '' })
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const setWorkspaceDetails = useAuthStore((store) => store.setWorkspaceDetails)
  const { updateDefaultServices, updateServices } = useUpdater()
  const { signIn, signUp, verifySignUp, signOut, userCred } = useAuth()

  const login = async (
    email: string,
    password: string,
    getWorkspace = false
  ): Promise<{ data: UserCred; v: string }> => {
    let data: any
    const v = await signIn(email, password)
      .then((d) => {
        setAuthenticated({ email })
        data = d
      })
      .then(updateDefaultServices)
      .then(updateServices)
      .then(() => 'success')
      .catch((e) => {
        console.error({ e })
        return e.toString() as string
      })

    if (getWorkspace && data !== undefined) {
      await client
        .get(apiURLs.getUserRecords(data.userId))
        .then((d) => {
          console.log(d.data)
          // Set workspace details
          setWorkspaceDetails({ id: d.data.id, name: d.data.name })
        })
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

  const verifySignup = async (code: string, metadata: any): Promise<string> => {
    const vSign = await verifySignUp(code, metadata).catch(console.error)
    console.log({ vSign })

    const loginData = await login(sensitiveData.email, sensitiveData.word).catch(console.error)

    if (!loginData) {
      return
    }

    const uCred = loginData.data
    const newWorkspaceName = `WD_${nanoid()}`

    if (vSign) {
      setRegistered(false)
    }

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
        setWorkspaceDetails({ id: d.data.id, name: d.data.name })
      })
    console.log({ workspace_details })

    return vSign
  }

  const logout = () => {
    signOut().then(() => setUnAuthenticated())
  }

  return { login, registerDetails, logout, verifySignup }
}
