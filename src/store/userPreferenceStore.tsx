import { mog } from '@utils/lib/helper'
import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { LastOpenedNotes, UserPreferences } from '../types/userPreference'
import { indexedDbStorageZustand } from './Adapters/indexedDB'
// import { baseMetaState, metaState, ZustandStoreMeta } from './middlewares/metaState'

interface UserPreferenceStore extends UserPreferences {
  setTheme: (theme: string) => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  getUserPreferences: () => UserPreferences
  setUserPreferences: (userPreferences: UserPreferences) => void
}

export const USER_PREF_STORE_KEY = 'mex-user-preference-store'

export const useUserPreferenceStore = create<UserPreferenceStore>(
  persist(
    devtools(
      (set, get) => ({
        lastOpenedNotes: {},
        version: 'unset',
        theme: 'xeM',
        getUserPreferences: () => {
          return {
            lastOpenedNotes: get().lastOpenedNotes,
            version: get().version,
            theme: get().theme
          }
        },
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

/**
 * Merging user preferences from the remote server with the local preferences
 *
 * The remote user preferences may be lagging as the local preferences
 * have not been saved on exit
 */
export const mergeUserPreferences = (local: UserPreferences, remote: UserPreferences): UserPreferences => {
  const { version, lastOpenedNotes, theme } = local
  const { lastOpenedNotes: remoteLastOpenedNotes } = remote

  // For all lastOpened of remote
  const mergedLastOpenedNotes = Object.keys(remoteLastOpenedNotes).reduce((acc, key) => {
    const localLastOpenedNote = lastOpenedNotes[key]
    const remoteLastOpenedNote = remoteLastOpenedNotes[key]
    // If a local lastOpenedNote exists
    if (localLastOpenedNote) {
      // Get the latest of the two which has the latest lastOpened
      const latestLastOpened =
        Math.max(localLastOpenedNote.ts, remoteLastOpenedNote.ts) === localLastOpenedNote.ts
          ? localLastOpenedNote
          : remoteLastOpenedNote
      acc[key] = latestLastOpened
    } else {
      // If no local lastOpenedNote exists
      acc[key] = remoteLastOpenedNote
    }
    return acc
  }, {})

  mog('mergedLastOpenedNotes', { lastOpenedNotes, mergedLastOpenedNotes, local, remote })
  return {
    version,
    // Overwrite all notes with the remote notes which exist
    // The local notes which do not exist in the remote notes will be left alone
    lastOpenedNotes: { ...lastOpenedNotes, ...mergedLastOpenedNotes },
    theme
  }
}
