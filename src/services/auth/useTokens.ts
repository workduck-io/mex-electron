import create from 'zustand'
import { useTokenData } from '../../hooks/useLocalData'
import { AuthToken, AuthTokenData, GoogleOAuthTokenData } from '../../types/auth'
import jwtDecode from 'jwt-decode'
import { formatDistanceToNow } from 'date-fns'
import { client } from '@workduck-io/dwindle'
import { GOOGLE_OAUTH2_REFRESH_URL } from '../../apis/routes'
import { mog } from '../../utils/lib/helper'

interface TokenStore {
  data: AuthTokenData
  setData: (data: AuthTokenData) => void
  addGoogleCalendarToken: (token: AuthToken) => AuthTokenData
  updateGoogleCalendarToken: (accessToken: string, idToken: string) => AuthTokenData
  removeGoogleCalendarToken: () => AuthTokenData
}

export const useTokenStore = create<TokenStore>((set, get) => ({
  data: {},
  setData: (data: AuthTokenData) => set({ data }),
  addGoogleCalendarToken: (token: AuthToken) => {
    const existingData = get().data

    const newData = {
      ...existingData,
      googleAuth: {
        calendar: token
      }
    }

    mog('ADD GOOGLE CALENDAR data', { existingData, newData })

    set({ data: newData })
    return newData
  },
  updateGoogleCalendarToken: (accessToken: string, refreshToken: string) => {
    const newData = {
      ...get().data,
      googleAuth: {
        calendar: {
          ...get().data.googleAuth.calendar,
          accessToken,
          refreshToken
        }
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
    mog('google calendar', { token })
    const tokenData = addGoogleCalendarTokenStore(token)
    setTokenData(tokenData)
  }

  return {
    addGoogleCalendarToken
  }
}

export type TokenStatus = 'absent' | 'expired' | 'active'

export const checkTokenGoogleCalendar = (tokens: AuthTokenData): TokenStatus => {
  if (
    !tokens.googleAuth ||
    !tokens.googleAuth.calendar ||
    !tokens.googleAuth.calendar.accessToken ||
    !tokens.googleAuth.calendar.idToken
  ) {
    return 'absent'
  }

  const decodedToken = jwtDecode<GoogleOAuthTokenData>(tokens.googleAuth.calendar.idToken)
  const now = Date.now()
  // const expDate = formatDistanceToNow(decodedToken.exp * 1000)

  if (!tokens.googleAuth.calendar.refreshToken) {
    console.error('No refresh token, cannot refresh')
    return 'absent'
  }

  // console.log('checkToken', {
  //   decodedToken,
  //   refreshToken: tokens.googleAuth.calendar.refreshToken,
  //   exp: decodedToken.exp,
  //   expDate,
  //   now
  // })

  if (decodedToken.exp * 1000 < now) {
    return 'expired'
  }

  return 'active'
}

export const fetchNewCalendarToken = async (refreshToken: string) => {
  const resp = await client
    .post(GOOGLE_OAUTH2_REFRESH_URL, {
      refreshToken
    })
    .catch((err) => {
      console.error('Error fetching new calendar token', err)
      return null
    })

  if (!resp) {
    return null
  }

  const accessToken = resp.data.data.access_token
  const idToken = resp.data.data.id_token
  console.log('fetchNewCalendarToken', {
    resp,
    accessToken,
    idToken
  })
  return { accessToken, idToken }
}
