import React from 'react'
import { ThemeProvider } from 'styled-components'
import { spotlightTheme } from '../Styled/themes'
import Routes from './Routes'
import { SpotlightProvider } from './utils/context'

export default function App() {
  return (
    <ThemeProvider theme={spotlightTheme}>
      <SpotlightProvider>
        <Routes />
      </SpotlightProvider>
    </ThemeProvider>
  )
}
