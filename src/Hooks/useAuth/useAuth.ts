import { useAuth, client } from '@workduck-io/dwindle'
import { nanoid } from 'nanoid'
import { apiURLs } from '../../Requests/routes'
import create from 'zustand'
import { useUpdater } from '../../Data/useUpdater'
import { WORKSPACE_ID } from '../../Defaults/auth'
import { useState } from 'react'

interface UserDetails {
  email: string
}

interface WorkspaceDetails {
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
  workspaceDetails: {
    id: WORKSPACE_ID
  },
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
  const { signIn, signUp, verifySignUp, signOut } = useAuth()

  const login = async (email: string, password: string, getWorkspace = false): Promise<string> => {
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

    if (getWorkspace) {
      await client
        .get(apiURLs.getUserRecords(data.userId))
        .then((d) => {
          console.log(d.data)
        })
        .catch((e) => {
          console.error({ e })
          return e.toString() as string
        })
    }

    return v
  }

  const registerDetails = (email: string, password: string) => {
    // tag: mex
    signUp(email, password).then(() => {
      setRegistered(true)
      setSensitiveData({ email, word: password })
    })
  }

  const verifySignup = async (code: string, metadata: any): Promise<string> => {
    const vSign = await verifySignUp(code, metadata).catch(console.error)
    await login(sensitiveData.email, sensitiveData.word).catch(console.error)
    await client
      .post(apiURLs.createWorkspace, { name: nanoid() })
      .then((d) => {
        setWorkspaceDetails({ id: d.data.id })
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
