import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'

import Bubble from '../../components/spotlight/Bubble'
import GlobalListener from '../../components/spotlight/GlobalListener'
import GlobalStyle from '../../style/spotlight/global'
import Login from '../../components/spotlight/Login'
import ProtectedRoute from './ProtectedRoute'
import { ROUTE_PATHS } from '../routes/urls'
import React from 'react'
import Spotlight from '../../components/spotlight'

const SpotlightRoute = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTE_PATHS.home} element={<ProtectedRoute component={Spotlight} />} />

        <Route path={ROUTE_PATHS.login} element={<Login />} />
      </Routes>
      <GlobalListener />
      <Bubble />
      <GlobalStyle />
    </HashRouter>
  )
}

export default SpotlightRoute
