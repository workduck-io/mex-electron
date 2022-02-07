import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Spotlight from '../../components/spotlight'
import GlobalStyle from '../../style/spotlight/global'
import Bubble from '../../components/spotlight/Bubble'
import GlobalListener from '../../components/spotlight/GlobalListener'
import ProtectedRoute from './ProtectedRoute'
import Login from '../../components/spotlight/Login'

const Routes = () => {
  return (
    <Router>
      <Switch>
        <ProtectedRoute exact path="/" component={Spotlight} />
        <Route path="/login" component={Login} />
      </Switch>
      <GlobalListener />
      <Bubble />
      <GlobalStyle />
    </Router>
  )
}

export default Routes
