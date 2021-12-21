import { ipcRenderer } from 'electron'
import React, { useEffect } from 'react'
import Modal from 'react-modal'
import { HashRouter as Router } from 'react-router-dom'
import Init from './Components/Init/Init'
import OnBoardingTour from './Components/Onboarding'
import { OnboardingTourConfig } from './Components/Onboarding/steps'
import useOnboard from './Components/Onboarding/store'
import Contexts from './Context/Contexts'
import Providers from './Context/Providers'
import { AppType } from './Data/useInitialize'
import Main from './Layout/Main'
import Modals from './Layout/Modals'
import initializeAmplify from './Requests/amplify/init'
import Switch from './Router/Switch'
import GlobalStyle from './Styled/Global'

Modal.setAppElement('#root')

initializeAmplify()

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
          </Main>
        </Contexts>
      </Providers>
    </Router>
  )
}

export default App
