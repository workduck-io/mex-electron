import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { LastOpenedNotes, UserProperties } from '../types/userProperties'

interface UserPropertiesStore extends UserProperties {
  setTheme: (theme: string) => void
  setLastOpenedNotes: (lastOpenedNotes: LastOpenedNotes) => void
  setUserProperties: (userProperties: UserProperties) => void
}

export const useUserPropertiesStore = create<UserPropertiesStore>(
  devtools(
    (set, get) => ({
      lastOpenedNotes: {},
      theme: 'xeM',
      setUserProperties: (userProperties: UserProperties) => {
        set(userProperties)
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
