import React from 'react';
import Modal from 'react-modal';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Lookup from './Components/Lookup';
import Refactor from './Components/Refactor/Refactor';
import sampleRCTree from './Components/Sidebar/sampleRCTreeData';
import Contexts from './Context/Contexts';
import Providers from './Context/Providers';
import MainEditor from './Editor/MainEditor';
import Main from './Layout/Main';
import GlobalStyle from './Styled/Global';
import Dashboard from './Views/Dashboard';
import Integrations from './Views/Integrations';
import Settings from './Views/Settings';
import Snippets from './Views/Snippets';
import Tasks from './Views/Tasks';

Modal.setAppElement('#root');

function App() {
  return (
    <Router>
      <Providers>
        <Contexts>
          <Main>
            <Lookup flatTree={sampleRCTree} />
            <Refactor />
            <Switch>
              <Route exact path="/editor" component={MainEditor} />
              <Route path="/tasks" component={Tasks} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/snippets" component={Snippets} />
              <Route path="/settings" component={Settings} />
              <Route path="/" component={Dashboard} />
            </Switch>
            <GlobalStyle />
          </Main>
        </Contexts>
      </Providers>
    </Router>
  );
}

export default App;
