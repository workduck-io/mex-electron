import create from 'zustand'
import { useTokenData } from '../../hooks/useLocalData'
import { AuthToken, AuthTokenData } from '../../types/auth'

interface TokenStore {
  data: AuthTokenData
  setData: (data: AuthTokenData) => void
  addGoogleCalendarToken: (token: AuthToken) => AuthTokenData
  removeGoogleCalendarToken: () => AuthTokenData
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  data: {},
  setData: (data: AuthTokenData) => set({ data }),
  addGoogleCalendarToken: (token: AuthToken) => {
    const newData = {
      ...get().data,
      googleAuth: {
        calendar: token
      }
    }
    set({ data: newData })
    return newData
  },
  removeGoogleCalendarToken: () => {
    const newData = {
      ...get().data,
      googleAuth: {
        ...get().data.googleAuth,
        calendar: undefined
      }
    }
    set({
      data: newData
    })
    return newData
  }
}))

export const useTokens = () => {
  const addGoogleCalendarTokenStore = useTokenStore((state) => state.addGoogleCalendarToken)
  const { setTokenData } = useTokenData()

  const addGoogleCalendarToken = (token: AuthToken) => {
    const tokenData = addGoogleCalendarTokenStore(token)
    setTokenData(tokenData)
  }

  return {
    addGoogleCalendarToken
  }
}
