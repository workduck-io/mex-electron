import { useVersionStore } from '@store/useAppDataStore'
import { useUserCacheStore } from '@store/useUserCacheStore'
import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { mog } from '@utils/lib/mog'


import { useApi } from '../../apis/useSaveApi'
import { UserPreferences } from '../../types/userPreference'
import { useAuthStore } from './useAuth'
import { API } from '../../API'

export interface TempUser {
  email: string
  userID?: string
  alias?: string
  name?: string
}

export interface TempUserUserID {
  userID: string
  email?: string
  alias?: string
  name?: string
}

export interface UserDetails {
  /** User ID */
  id: string
  /** Workspace ID */
  group: string
  entity: 'User'
  email: string
  name: string
  alias: string
  preference: UserPreferences
}

export const useUserService = () => {
  const addUser = useUserCacheStore((s) => s.addUser)
  const getUser = useUserCacheStore((s) => s.getUser)
  const updateUserDetails = useAuthStore((s) => s.updateUserDetails)
  const getUserDetails = async (email: string): Promise<TempUser> => {
    const user = getUser({ email })
    if (user) return user

    try {
      return await API.user.getByMail(email)
    } catch (e) {
      mog('Error Fetching User Details', { error: e, email })
      return { email }
    }
  }

  const getUserDetailsUserId = async (userID: string): Promise<TempUserUserID> => {
    const user = getUser({ userID })
    if (user) return user

    try {
      return await API.user.getByID(userID).then((resp) => {
        mog('Response', { data: resp })
        if (resp?.email && resp?.name) {
            addUser({
              userID,
              email: resp?.email,
              alias: resp?.alias ?? resp?.data?.name,
              name: resp?.name
            })
          }
          return {
            userID,
            email: resp?.email ?? undefined,
            alias: resp?.alias ?? resp?.data?.name,
            name: resp?.name
          }
        })
    } catch (e) {
      mog('Error Fetching User Details', { error: e, userID })
      return { userID }
    }
  }

  const updateUserInfo = async (userID: string, name?: string, alias?: string): Promise<boolean> => {
    try {
      if (name === undefined && alias === undefined) return false
      return await API.user.updateInfo({ id: userID, name, alias }).then((resp) => {
        mog('Response', { data: resp })
        updateUserDetails({ name: resp?.name, alias: resp?.alias })
        return true
      })
    } catch (e) {
      mog('Error Updating User Info', { error: e, userID })
      return false
    }
  }

  const updateUserPreferences = async (): Promise<boolean> => {
    const lastOpenedNotes = useUserPreferenceStore.getState().lastOpenedNotes
    const lastUsedSnippets = useUserPreferenceStore.getState().lastUsedSnippets
    const theme = useUserPreferenceStore.getState().theme
    const userID = useAuthStore.getState().userDetails.userID
    const version = useVersionStore.getState().version

    const userPreferences: UserPreferences = {
      version,
      lastOpenedNotes,
      lastUsedSnippets,
      theme
    }

    try {
      return await API.user.updatePreference( userPreferences ).then((resp) => {
        return true
      })
    } catch (e) {
      mog('Error Updating User Info', { error: e, userID })
      return false
    }
  }

  const getCurrentUser = async (): Promise<UserDetails | undefined> => {
    try {
      return await API.user.getCurrent()
    } catch (e) {
      mog('Error Fetching Current User Info', { error: e })
      return undefined
    }
  }

  const getAllKnownUsers = () => {
    const cache = useUserCacheStore.getState().cache
    return cache
  }

  return {
    getAllKnownUsers,
    getUserDetails,
    getUserDetailsUserId,
    updateUserInfo,
    updateUserPreferences,
    getCurrentUser
  }
}
