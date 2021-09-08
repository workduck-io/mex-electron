import React from 'react'
import Modal from 'react-modal'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Contexts from './Context/Contexts'
import Providers from './Context/Providers'
import ContentEditor from './Editor/ContentEditor'
import Main from './Layout/Main'
import Modals from './Layout/Modals'
import SnippetEditor from './Snippets/SnippetEditor'
import GlobalStyle from './Styled/Global'
import Dashboard from './Views/Dashboard'
import Integrations from './Views/Integrations'
import Settings from './Views/Settings'
import Snippets from './Views/Snippets'
import Tasks from './Views/Tasks'

Modal.setAppElement('#root')

function App() {
  return (
    <Router>
      <Providers>
        <Contexts>
          <Main>
            {/* Modals */}
            <Modals />

            {/* Main Content */}
            <Switch>
              <Route path="/editor" component={ContentEditor} />
              <Route path="/tasks" component={Tasks} />
              <Route path="/integrations" component={Integrations} />
              <Route exact path="/snippets" component={Snippets} />
              <Route exact path="/snippets/editor" component={SnippetEditor} />
              <Route path="/settings" component={Settings} />
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
