import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { LastOpenedNotes, UserPreferences } from '../types/userPreference'
import { indexedDbStorageZustand } from './Adapters/indexedDB'
// import { baseMetaState, metaState, ZustandStoreMeta } from './middlewares/metaState'

interface UserPreferenceStore extends UserPreferences {
  setTheme: (theme: string) => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  setUserPreferences: (userPreferences: UserPreferences) => void
}

export const USER_PREF_STORE_KEY = 'mex-user-preference-store'

export const useUserPreferenceStore = create<UserPreferenceStore>(
  persist(
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
      { name: 'User Preferences' }
    ),
    {
      name: USER_PREF_STORE_KEY,
      getStorage: () => indexedDbStorageZustand
    }
  )
)
