import GlobalStyle from './style/spotlight/global'
import { IS_DEV } from './data/Defaults/dev_'
import Notifier from './components/toast/Notifier'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { defaultThemes } from './style/themes/defaultThemes'
import { initializeSentry } from './services/sentry'
import useThemeStore from './store/useThemeStore'

if (!IS_DEV) initializeSentry()

export default function App() {
  const theme = useThemeStore((state) => state.theme)

  const currentTheme = theme?.themeData ?? defaultThemes[0].themeData

  return (
    <ThemeProvider theme={currentTheme}>
      <Notifier />
      <GlobalStyle />
    </ThemeProvider>
  )
}
