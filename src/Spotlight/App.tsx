import React from 'react'
import OnBoardingTour from '../Components/Onboarding'
import { ThemeProvider } from 'styled-components'
import useThemeStore from '../Editor/Store/ThemeStore'
import initializeAmplify from '../Requests/amplify/init'
import { defaultThemes } from '../Styled/themes/defaultThemes'
import Routes from './Routes'
import { SpotlightProvider } from './utils/context'
import { SpotlightOnboarding } from '../Components/Onboarding/steps'

initializeAmplify()

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
