import React from 'react'
import OnBoardingTour from './components/mex/Onboarding'
import { ThemeProvider } from 'styled-components'
import useThemeStore from './store/useThemeStore'
import { defaultThemes } from './style/themes/defaultThemes'
import Routes from './views/spotlight/routes'
import { SpotlightProvider } from './store/Context/context.spotlight'
import { initializeSentry } from './services/sentry'
import { SpotlightOnboarding } from './components/mex/Onboarding/sections/Spotlight/steps'
import { IS_DEV } from './data/Defaults/dev_'

if (!IS_DEV) initializeSentry()

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
