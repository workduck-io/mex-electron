import React from 'react'
import Modal from 'react-modal'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Contexts from './Context/Contexts'
import Providers from './Context/Providers'
import Main from './Layout/Main'
import Modals from './Layout/Modals'
import initializeAmplify from './Requests/amplify/init'
import SnippetEditor from './Snippets/SnippetEditor'
import GlobalStyle from './Styled/Global'
import Dashboard from './Views/Dashboard'
import EditorView from './Views/EditorView'
import Integrations from './Views/Integrations'
import Login from './Views/Login'
import Settings from './Views/Settings'
import Snippets from './Views/Snippets'
import Tasks from './Views/Tasks'

Modal.setAppElement('#root')

initializeAmplify()

function App () {
  return (
    <Router>
      <Providers>
        <Contexts>
          <Main>
            {/* Modals */}
            <Modals />

            {/* Main Content */}
            <Switch>
              <Route path="/editor" component={EditorView} />
              <Route path="/tasks" component={Tasks} />
              <Route path="/integrations" component={Integrations} />
              <Route exact path="/snippets" component={Snippets} />
              <Route exact path="/snippets/editor" component={SnippetEditor} />
              <Route path="/settings" component={Settings} />
              <Route path="/login" component={Login} />
              <Route path="/" component={Dashboard} />
            </Switch>

            {/* Non-Rendering components */}
            <GlobalStyle />
          </Main>
        </Contexts>
      </Providers>
    </Router>
  )
}

export default App
