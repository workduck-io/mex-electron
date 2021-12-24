import React from 'react'
import { ThemeProvider } from 'styled-components'
import useThemeStore from '../Editor/Store/ThemeStore'
import { defaultThemes } from '../Styled/themes/defaultThemes'
import Routes from './Routes'
import { SpotlightProvider } from './utils/context'
import { initializeSentry } from '../sentry'

initializeSentry()

export default function App() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
      <SpotlightProvider>
        <Routes />
      </SpotlightProvider>
    </ThemeProvider>
  )
}
