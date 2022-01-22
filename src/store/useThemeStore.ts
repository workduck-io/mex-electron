import { DefaultTheme } from 'styled-components'
import create from 'zustand'
import { defaultThemes } from '../style/themes/defaultThemes'

interface Theme {
  id: string
  themeData: DefaultTheme
}

interface ThemeStoreState {
  theme: Theme
  themes: Theme[]
  setTheme: (theme: Theme) => void
  setThemes: (theme: Theme[]) => void
}

const useThemeStore = create<ThemeStoreState>((set) => ({
  theme: defaultThemes[3],

  themes: defaultThemes,

  setTheme: (theme: Theme) => {
    set({ theme })
  },

  setThemes: (themes: Theme[]) => {
    set({ themes })
  }
}))

export default useThemeStore