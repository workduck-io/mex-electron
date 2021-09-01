import { airTheme } from './airTheme'
import { devTheme } from './devTheme'
import { dnshTheme } from './dnshTheme'
import { gruvboxTheme } from './gruvboxTheme'
import { lightTheme } from './lightTheme'
import { matrixTheme } from './matrixTheme'
import { reduxTheme } from './reduxTheme'
import { vvkTheme } from './vvkTheme'

export const defaultThemes = [
  { id: 'gruvy', themeData: gruvboxTheme },
  { id: 'redux', themeData: reduxTheme },
  { id: 'dev', themeData: devTheme },
  { id: 'matrix', themeData: matrixTheme },
  { id: 'light', themeData: lightTheme },
  { id: 'air', themeData: airTheme },
  { id: 'vvk', themeData: vvkTheme },
  { id: 'dnsh', themeData: dnshTheme }
]

export const getTheme = (themeId: string) => {
  const theme = defaultThemes.filter((t) => t.id === themeId)
  if (theme.length > 0) return theme[0]
  return defaultThemes[0]
}
