import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import SampleMarkdown from './Conf/sampleMarkdown';
import Editor from './Editor/Editor';
import Main from './Layout/Main';
import normalize from './Styled/normalize';
import { darkTheme, lightTheme } from './Styled/themes';
import Dashboard from './Views/Dashboard';

const GlobalStyle = createGlobalStyle`
  ${normalize}; // NormalizeCSS normalization

  body {
    min-height: 100vh;
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.background.app};
    font-family: Inter, sans-serif;
    display: flex;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary};

    &:hover {
      text-decoration: underline;
      text-decoration-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

function App() {
  const [theme] = React.useState<'dark' | 'light'>('dark');

  return (
    <Router>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <Main>
          <GlobalStyle />
          <Switch>
            <Route
              exact
              path="/editor"
              component={() => <Editor content={SampleMarkdown} />}
            />
            <Route path="/" component={() => <Dashboard files={23} />} />
          </Switch>
        </Main>
      </ThemeProvider>
    </Router>
  );
}

export default App;
