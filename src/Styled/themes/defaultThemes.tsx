import { airTheme } from './airTheme'
import { devTheme } from './devTheme'
import { spotlightTheme } from './spotlightTheme'
import { lightTheme } from './lightTheme'
import { matrixTheme } from './matrixTheme'
import { reduxTheme } from './reduxTheme'
import { vvkTheme } from './vvkTheme'
import { gruvboxTheme } from './gruvboxTheme'

export const defaultThemes = [
  { id: 'gruvy', themeData: gruvboxTheme },
  { id: 'redux', themeData: reduxTheme },
  { id: 'dev', themeData: devTheme },
  { id: 'matrix', themeData: matrixTheme },
  { id: 'light', themeData: lightTheme },
  { id: 'air', themeData: airTheme },
  { id: 'vvk', themeData: vvkTheme },
  { id: 'spotlight', themeData: spotlightTheme }
]

export const getTheme = (themeId: string) => {
  const theme = defaultThemes.filter((t) => t.id === themeId)
  if (theme.length > 0) return theme[0]
  return defaultThemes[0]
}
