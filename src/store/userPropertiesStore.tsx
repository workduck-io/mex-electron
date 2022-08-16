import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { LastOpenedNotes, UserPreferences } from '../types/userProperties'

interface UserPreferenceStore extends UserPreferences {
  setTheme: (theme: string) => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  setUserPreferences: (userProperties: UserPreferences) => void
}

export const useUserPreferenceStore = create<UserPreferenceStore>(
  devtools(
    (set, get) => ({
      lastOpenedNotes: {},
      theme: 'xeM',
      setUserPreferences: (userPreferences: UserPreferences) => {
        set(userPreferences)
      },
      setTheme: (theme) => {
        set({ theme })
      },
      setLastOpenedNotes: (lastOpenedNotes) => {
        set({
          lastOpenedNotes: lastOpenedNotes
        })
      }
    }),
    { name: 'User Properties' }
  )
)
