import { useEffect } from 'react'
import { useUserService } from '@services/auth/useUserService'
import { mog } from '@utils/lib/helper'
import { useUserPreferenceStore } from '@store/userPreferenceStore'

const USER_PREF_AUTO_SAVE_MS = 30 * 60 * 1000 // 30 minutes

export const useAutoSyncUserPreference = () => {
  const setUserPreferences = useUserPreferenceStore((store) => store.setUserPreferences)
  const { updateUserPreferences, getCurrentUser } = useUserService()

  const updateCurrentUserPreferences = async () => {
    const user = await getCurrentUser()
    if (user) {
      const userPreferences = user.preference
      mog('User Preferences Fetched: ', { userPreferences })
      if (userPreferences) {
        setUserPreferences(userPreferences)
      }
      // setUserPreferences(userPreferences)
    }
    // return user.preference
  }

  /**
   * Fetches the user preference once
   */
  useEffect(() => {
    // mog(`Fetching User Preferences`)
    updateCurrentUserPreferences()
  }, [])

  /**
   * Saves the user preference at every interval
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateUserPreferences()
    }, USER_PREF_AUTO_SAVE_MS)
    return () => clearInterval(intervalId)
  }, [])
}
