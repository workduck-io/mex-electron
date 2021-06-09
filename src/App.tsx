import React from 'react';
import Modal from 'react-modal';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Lookup, { LookupStyles } from './Components/Lookup';
import sampleRCTree from './Components/Sidebar/sampleRCTreeData';
import SampleMarkdown from './Conf/sampleMarkdown';
import { ProvideEditorContext } from './Context/Editor';
import Editor from './Editor/Editor';
import Main from './Layout/Main';
import { ThinScrollbar } from './Styled/helpers';
import normalize from './Styled/normalize';
import { darkTheme, lightTheme } from './Styled/themes';
import Dashboard from './Views/Dashboard';
import Integrations from './Views/Integrations';
import Snippets from './Views/Snippets';
import Tasks from './Views/Tasks';

Modal.setAppElement('#root');

const GlobalStyle = createGlobalStyle`
  ${normalize}; // NormalizeCSS normalization

  body {
    min-height: 100vh;
    display: flex;
    font-family: Inter, sans-serif;
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.app};
    
    ${ThinScrollbar};
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.colors.primary};
    }
  }

  #root {
    width: 100%;
  }
  
  ${LookupStyles};
`;

function App() {
  const [theme] = React.useState<'dark' | 'light'>('dark');

  return (
    <Router>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <ProvideEditorContext>
          <Main>
            <Lookup flatTree={sampleRCTree} />
            <Switch>
              <Route
                exact
                path="/editor"
                component={() => <Editor content={SampleMarkdown} />}
              />
              <Route path="/tasks" component={Tasks} />
              <Route path="/integrations" component={Integrations} />
              <Route path="/snippets" component={Snippets} />
              <Route path="/" component={Dashboard} />
            </Switch>
            <GlobalStyle />
          </Main>
        </ProvideEditorContext>
      </ThemeProvider>
    </Router>
  );
}

export default App;
