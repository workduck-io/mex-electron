import create from 'zustand'
import { useUpdater } from '../../Data/useUpdater'
import { WORKSPACE_ID } from '../../Defaults/auth'
import { confirmSignUp, signIn, signUp } from '../../Requests/Auth/Auth'

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
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  authenticated: true,
  registered: false,
  userDetails: undefined,
  workspaceDetails: {
    id: WORKSPACE_ID
  },
  setAuthenticated: (userDetails) => set({ authenticated: true, userDetails }),
  setUnAuthenticated: () => set({ authenticated: false, userDetails: undefined }),
  setRegistered: (val) => set({ registered: val })
}))

export const useAuthentication = () => {
  const setAuthenticated = useAuthStore((store) => store.setAuthenticated)
  const setUnAuthenticated = useAuthStore((store) => store.setUnAuthenticated)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const { updateDefaultServices, updateServices } = useUpdater()

  const login = async (email: string, password: string) => {
    signIn({ email, password })
      .then(() => {
        setAuthenticated({ email })
      })
      .then(updateDefaultServices)
      .then(updateServices)
  }

  const registerDetails = (email: string, password: string) => {
    signUp({
      email,
      password
    }).then(() => {
      setRegistered(true)
    })
  }

  const verifySignup = (email: string, code: string) => {
    confirmSignUp({ email, code }).then(() => {
      setRegistered(false)
      setAuthenticated({ email })
    })
  }

  const logout = () => {
    setUnAuthenticated()
  }

  return { login, registerDetails, logout, verifySignup }
}
