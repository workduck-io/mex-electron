import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Spotlight from './components/Spotlight'
import MexIt from './components/MexIt'
import GlobalStyle from './styles/global'
import Bubble from './components/Bubble'
import Settings from './components/Settings'

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Spotlight} />
        <Route path="/new" component={MexIt} />
        <Route path="/settings" component={Settings} />
      </Switch>
      <Bubble />
      <GlobalStyle />
    </Router>
  )
}

export default Routes
