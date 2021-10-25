import { useAuth } from '@workduck-io/dwindle'
import create from 'zustand'
import { useUpdater } from '../../Data/useUpdater'
import { WORKSPACE_ID } from '../../Defaults/auth'

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
  authenticated: false,
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
  const { signIn, signUp, verifySignUp, signOut } = useAuth()

  const login = async (email: string, password: string) => {
    signIn(email, password)
      .then(() => {
        setAuthenticated({ email })
      })
      .then(updateDefaultServices)
      .then(updateServices)
  }

  const registerDetails = (email: string, password: string) => {
    signUp(email, password).then(() => {
      setRegistered(true)
    })
  }

  const verifySignup = async (code: string): Promise<string> => {
    const vSign = await verifySignUp(code)
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
