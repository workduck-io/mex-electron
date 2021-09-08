import React from 'react'
import { HashRouter as Router, Switch, Route } from 'react-router-dom'
import Spotlight from './components/Spotlight'
import New from './components/New'
import GlobalStyle from './styles/global'
import Bubble from './components/Bubble'

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Spotlight} />
        <Route path="/new" component={New} />
      </Switch>
      <Bubble />
      <GlobalStyle />
    </Router>
  )
}

export default Routes
