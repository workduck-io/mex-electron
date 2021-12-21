import React from 'react'
import OnBoardingTour from '../Components/Onboarding'
import { ThemeProvider } from 'styled-components'
import useThemeStore from '../Editor/Store/ThemeStore'
import { defaultThemes } from '../Styled/themes/defaultThemes'
import Routes from './Routes'
import { SpotlightProvider } from './utils/context'
import { initializeSentry } from '../sentry'
import { SpotlightOnboarding } from '../Components/Onboarding/steps'

initializeSentry()

export default function App() {
  const theme = useThemeStore((state) => state.theme)

  return (
    <ThemeProvider theme={theme?.themeData ?? defaultThemes[0].themeData}>
      <SpotlightProvider>
        <Routes />
        <OnBoardingTour steps={SpotlightOnboarding} />
      </SpotlightProvider>
    </ThemeProvider>
  )
}
