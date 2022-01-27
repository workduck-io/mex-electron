import React from 'react'
import Modal from 'react-modal'
import { HashRouter as Router } from 'react-router-dom'
import Init from './components/mex/Init/Init'
import OnBoardingTour from './components/mex/Onboarding'
import { OnboardingTourConfig } from './components/mex/Onboarding/steps'
import Contexts from './store/Context/Contexts'
import Providers from './store/Context/Providers'
import Main from './components/layouts/Main'
import Modals from './components/layouts/Modals'
import Switch from './views/router/Switch'
import GlobalStyle from './style/Global'
import { initializeSentry } from './services/sentry'
import { IS_DEV } from './data/Defaults/dev_'
import FloatingButton from './components/mex/FloatingButton'
import { Notifications } from './components/mex/Notifications/Notifications'

if (!IS_DEV) initializeSentry()

Modal.setAppElement('#root')
initializeSentry()

function App() {
  return (
    <Router>
      <Providers>
        <Contexts>
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
        </Contexts>
      </Providers>
    </Router>
  )
}

export default App
