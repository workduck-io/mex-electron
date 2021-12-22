import React from 'react'
import Modal from 'react-modal'
import { HashRouter as Router } from 'react-router-dom'
import Init from './Components/Init/Init'
import Contexts from './Context/Contexts'
import Providers from './Context/Providers'
import Main from './Layout/Main'
import Modals from './Layout/Modals'
import initializeAmplify from './Requests/amplify/init'
import Switch from './Router/Switch'
import GlobalStyle from './Styled/Global'
import { initializeSentry } from './sentry'

Modal.setAppElement('#root')

initializeAmplify()
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

            {/* Non-Rendering components */}
            <GlobalStyle />
          </Main>
        </Contexts>
      </Providers>
    </Router>
  )
}

export default App
