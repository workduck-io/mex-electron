import React from 'react'

import { ErrorBoundary } from 'react-error-boundary'
import Modal from 'react-modal'
import { HashRouter as Router } from 'react-router-dom'

import Main from './components/layouts/Main'
import Modals from './components/layouts/Modals'
import MexErrorFallback from './components/mex/Error/MexErrorFallback'
import FloatingButton from './components/mex/FloatingButton'
import Init from './components/mex/Init/Init'
import { VersionSetter } from './components/mex/Init/VersionSetter'
import { Notifications } from './components/mex/Notifications/Notifications'
import OnBoardingTour from './components/mex/Onboarding'
import { OnboardingTourConfig } from './components/mex/Onboarding/steps'
import { initializeSentry } from './services/sentry'
import Contexts from './store/Context/Contexts'
import Providers from './store/Context/Providers'
import GlobalStyle from './style/Global'
import Switch from './views/router/Switch'

initializeSentry()

Modal.setAppElement('#root')

function App() {
  return (
    <Router>
      <Providers>
        <Contexts>
          <ErrorBoundary FallbackComponent={MexErrorFallback}>
            <VersionSetter />
            <Init />
            <Main>
              {/* Modals */}
              <Modals />

              {/* Main Content */}
              <Switch />

              {/* Onboard User */}
              <OnBoardingTour steps={OnboardingTourConfig} />

              {/* Non-Rendering components */}
              <GlobalStyle />
              {/* Floating help modal button */}
              <FloatingButton />
              <Notifications />
            </Main>
          </ErrorBoundary>
        </Contexts>
      </Providers>
    </Router>
  )
}

export default App
