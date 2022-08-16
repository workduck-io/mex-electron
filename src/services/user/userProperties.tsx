import create from 'zustand'

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

export const useUserPropertiesStore = create<UserPropertiesStore>((set) => ({
  lastOpenedNotes: {},
  mutedNotes: [],
  theme: 'xeM',

  set: (userProperties) => {
    set(userProperties)
  },

  setTheme: (theme) => {
    set({ theme })
  }
}))
