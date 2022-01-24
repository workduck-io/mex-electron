import { devTheme } from './devTheme'
import { gruvboxTheme } from './gruvboxTheme'
import { lightTheme } from './lightTheme'
import { matrixTheme } from './matrixTheme'
import { reduxTheme } from './reduxTheme'
import { sapphireTheme } from './sapphireTheme'
import { spotlightTheme } from './spotlightTheme'
import { vvkTheme } from './vvkTheme'

export const defaultThemes = [
  { id: 'Gruvbox', themeData: gruvboxTheme },
  { id: 'Gruvbox+', themeData: reduxTheme },
  { id: 'Dev', themeData: devTheme },
  { id: 'Dev+', themeData: matrixTheme },
  { id: 'Amethyst', themeData: vvkTheme },
  { id: 'Light', themeData: lightTheme },
  { id: 'Sapphire', themeData: sapphireTheme },
  { id: 'Clean', themeData: spotlightTheme }
]

export const getTheme = (themeId: string) => {
  const theme = defaultThemes.filter((t) => t.id === themeId)
  if (theme.length > 0) return theme[0]
  return defaultThemes[0]
}
