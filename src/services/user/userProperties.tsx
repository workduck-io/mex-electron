import create from 'zustand'
import { devtools } from 'zustand/middleware'

interface LastOpenedNodes {
  // Nodeid with date of last opened
  [key: string]: number
}

interface UserProperties {
  lastOpenedNotes: LastOpenedNodes
  mutedNotes: string[]
  theme?: string
}

interface UserPropertiesStore extends UserProperties {
  set: (userProperties: UserProperties) => void
  setTheme: (theme: string) => void
}

export const useUserPropertiesStore = create<UserPropertiesStore>(
  devtools(
    (set) => ({
      lastOpenedNotes: {},
      mutedNotes: [],
      theme: 'xeM',

      set: (userProperties) => {
        set(userProperties)
      },

      setTheme: (theme) => {
        set({ theme })
      }
    }),
    { name: 'User Properties' }
  )
)
