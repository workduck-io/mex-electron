import React from 'react'
import { defaultThemes } from '../Styled/themes/defaultThemes'
import { ThemeProvider } from 'styled-components'

import Routes from './Routes'
import { SpotlightProvider } from './utils/context'
import useThemeStore from '../Editor/Store/ThemeStore'

export default function App () {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
      <SpotlightProvider>
        <Routes />
      </SpotlightProvider>
    </ThemeProvider>
  )
}
