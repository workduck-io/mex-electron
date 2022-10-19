import React from 'react'

import { addIconsToIconify } from '@components/icons/Icons'
import { actionMenuStore, MenuProvider } from '@components/spotlight/ActionStage/ActionMenu/useActionMenuStore'
import { actionStore, Provider } from '@components/spotlight/Actions/useActionStore'
import Providers from '@store/Context/Providers'

import { VersionSetter } from './components/mex/Init/VersionSetter'
import OnBoardingTour from './components/mex/Onboarding'
import { SpotlightOnboarding } from './components/mex/Onboarding/steps'
import { initializeSentry } from './services/sentry'
import { SpotlightProvider } from './store/Context/context.spotlight'
import Routes from './views/spotlight/routes'

initializeSentry()

export default function App() {
  addIconsToIconify()
  return (
    <Provider createStore={actionStore}>
      <MenuProvider createStore={actionMenuStore}>
        <Providers>
          <SpotlightProvider>
            <Routes />
            <OnBoardingTour steps={SpotlightOnboarding} />
            <VersionSetter />
          </SpotlightProvider>
        </Providers>
      </MenuProvider>
    </Provider>
  )
}
