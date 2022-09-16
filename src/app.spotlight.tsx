import { addIconsToIconify } from '@components/icons/Icons'
import { actionStore, Provider } from '@components/spotlight/Actions/useActionStore'
import { actionMenuStore, MenuProvider } from '@components/spotlight/ActionStage/ActionMenu/useActionMenuStore'
import Providers from '@store/Context/Providers'
import React from 'react'
import { VersionSetter } from './components/mex/Init/VersionSetter'
import OnBoardingTour from './components/mex/Onboarding'
import { SpotlightOnboarding } from './components/mex/Onboarding/steps'
import { IS_DEV } from './data/Defaults/dev_'
import { initializeSentry } from './services/sentry'
import { SpotlightProvider } from './store/Context/context.spotlight'
import Routes from './views/spotlight/routes'

if (!IS_DEV) initializeSentry()

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
