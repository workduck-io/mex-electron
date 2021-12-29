import { ipcRenderer } from 'electron'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { HashRouter as Router } from 'react-router-dom'
import Init from './Components/Init/Init'
import OnBoardingTour from './Components/Onboarding'
import { OnboardingTourConfig } from './Components/Onboarding/steps'
import Contexts from './Context/Contexts'
import Providers from './Context/Providers'
import Main from './Layout/Main'
import Modals from './Layout/Modals'
import Switch from './Router/Switch'
import GlobalStyle from './Styled/Global'
import { initializeSentry } from './sentry'
import { IS_DEV } from './Defaults/dev_'
import FloatingButton from './Components/FloatingButton'

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
          </Main>
        </Contexts>
      </Providers>
    </Router>
  )
}

export default App
