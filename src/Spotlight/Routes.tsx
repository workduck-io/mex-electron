import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Spotlight from './components/Spotlight';
import New from './components/New';
import GlobalStyle from './styles/global';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Spotlight} />
        <Route path="/new" component={New} />
      </Switch>
      <GlobalStyle />
    </Router>
  );
};

export default Routes;
