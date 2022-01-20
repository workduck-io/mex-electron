import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Spotlight from './components/Spotlight'
import MexIt from './components/MexIt'
import GlobalStyle from './styles/global'
import Bubble from './components/Bubble'
import Settings from './components/Settings'
import GlobalListener from './components/GlobalListener'
import ProtectedRoute from './ProtectedRoute'
import Login from './components/Login'

const Routes = () => {
  return (
    <Router>
      <Switch>
        <ProtectedRoute exact path="/" component={Spotlight} />
        <ProtectedRoute path="/new" component={MexIt} />
        <ProtectedRoute path="/settings" component={Settings} />
        <Route path="/login" component={Login} />
      </Switch>
      <GlobalListener />
      <Bubble />
      <GlobalStyle />
    </Router>
  )
}

export default Routes
