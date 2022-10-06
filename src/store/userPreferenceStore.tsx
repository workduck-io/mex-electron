import create from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { LastOpenedNotes, LastUsedSnippets, UserPreferences, LastOpenedData } from '../types/userPreference'
import { indexedDbStorageZustand } from './Adapters/indexedDB'

// import { baseMetaState, metaState, ZustandStoreMeta } from './middlewares/metaState'

interface UserPreferenceStore extends UserPreferences {
  _hasHydrated: boolean
  setHasHydrated: (state) => void
  setTheme: (theme: string) => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  setLastUsedSnippets: (lastUsedSnippets: LastUsedSnippets) => void
  getUserPreferences: () => UserPreferences
  setUserPreferences: (userPreferences: UserPreferences) => void
  setActiveNamespace: (namespace: string) => void
}

export const USER_PREF_STORE_KEY = 'mex-user-preference-store'

export const useUserPreferenceStore = create<UserPreferenceStore>()(
  persist(
    devtools(
      (set, get) => ({
        lastOpenedNotes: {},
        lastUsedSnippets: {},
        version: 'unset',
        theme: 'xeM',
        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state
          })
        },
        getUserPreferences: () => {
          return {
            lastOpenedNotes: get().lastOpenedNotes,
            version: get().version,
            lastUsedSnippets: get().lastUsedSnippets,
            theme: get().theme
          }
        },
        setUserPreferences: (userPreferences: UserPreferences) => {
          set(userPreferences)
        },
        setTheme: (theme) => {
          set({ theme })
        },
        setActiveNamespace: (namespace: string) => {
          set({ activeNamespace: namespace })
        },
        setLastUsedSnippets: (lastUsedSnippets) => {
          set({ lastUsedSnippets })
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
      getStorage: () => indexedDbStorageZustand,
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      }
    }
  )
)

export const mergeLastOpenedData = (
  remote: Record<string, LastOpenedData>,
  local: Record<string, LastOpenedData>
): Record<string, LastOpenedData> => {
  const merged = Object.keys(remote).reduce((acc, key) => {
    const localLastOpenedNote = local[key]
    const remoteLastOpenedNote = remote[key]
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

  return merged
}

/**
 * Merging user preferences from the remote server with the local preferences
 *
 * The remote user preferences may be lagging as the local preferences
 * have not been saved on exit
 */
export const mergeUserPreferences = (local: UserPreferences, remote: UserPreferences): UserPreferences => {
  const { version, theme } = local

  // For all lastOpened of remote
  const mergedLastOpenedNotes = mergeLastOpenedData(remote.lastOpenedNotes, local.lastOpenedNotes)
  const mergedLastUsedSnippets = mergeLastOpenedData(remote.lastUsedSnippets, local.lastUsedSnippets)

  // mog('mergedLastOpenedNotes', { localLastOpenedNotes, mergedLastOpenedNotes, local, remote })
  return {
    version,
    // Overwrite all notes with the remote notes which exist
    // The local notes which do not exist in the remote notes will be left alone
    lastOpenedNotes: { ...local.lastOpenedNotes, ...mergedLastOpenedNotes },
    lastUsedSnippets: { ...local.lastUsedSnippets, ...mergedLastUsedSnippets },
    theme
  }
}
