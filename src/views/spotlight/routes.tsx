import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Spotlight from '../../components/spotlight'
import GlobalStyle from '../../style/spotlight/global'
import Bubble from '../../components/spotlight/Bubble'
import GlobalListener from '../../components/spotlight/GlobalListener'
import ProtectedRoute from './ProtectedRoute'
import Login from '../../components/spotlight/Login'
import { ROUTE_PATHS } from '../routes/urls'

const SpotlightRoute = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTE_PATHS.home} element={<ProtectedRoute component={Spotlight} />} />
        <Route path={ROUTE_PATHS.login} element={<Login />} />
      </Routes>
      <GlobalListener />
      <Bubble />
      <GlobalStyle />
    </Router>
  )
}

export default SpotlightRoute
