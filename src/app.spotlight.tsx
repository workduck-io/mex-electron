import { actionStore, Provider } from '@components/spotlight/Actions/useActionStore'
import { actionMenuStore, MenuProvider } from '@components/spotlight/ActionStage/ActionMenu/useActionMenuStore'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { VersionSetter } from './components/mex/Init/VersionSetter'
import OnBoardingTour from './components/mex/Onboarding'
import { SpotlightOnboarding } from './components/mex/Onboarding/steps'
import { IS_DEV } from './data/Defaults/dev_'
import { initializeSentry } from './services/sentry'
import { SpotlightProvider } from './store/Context/context.spotlight'
import useThemeStore from './store/useThemeStore'
import { defaultThemes } from './style/themes/defaultThemes'
import Routes from './views/spotlight/routes'

if (!IS_DEV) initializeSentry()

export default function App() {
  const theme = useThemeStore((state) => state.theme)

  const currentTheme = theme?.themeData ?? defaultThemes[0].themeData

  return (
    <Provider createStore={actionStore}>
      <MenuProvider createStore={actionMenuStore}>
        <ThemeProvider theme={currentTheme}>
          <SpotlightProvider>
            <Routes />
            <OnBoardingTour steps={SpotlightOnboarding} />
            <VersionSetter />
          </SpotlightProvider>
        </ThemeProvider>
      </MenuProvider>
    </Provider>
  )
}
