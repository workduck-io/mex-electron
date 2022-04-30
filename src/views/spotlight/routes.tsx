import { HashRouter, Route, Routes } from 'react-router-dom'

import Bubble from '../../components/spotlight/Bubble'
import GlobalListener from '../../components/spotlight/GlobalListener'
import GlobalStyle from '../../style/spotlight/global'
import Login from '../../components/spotlight/Login'
import ProtectedRoute from './ProtectedRoute'
import { ROUTE_PATHS } from '../routes/urls'
import React from 'react'
import Spotlight from '../../components/spotlight'
import Content from '../../components/spotlight/Content'
import PerformersContainer from '../../components/spotlight/ActionStage/Performers'
import { ViewPage } from '../../components/spotlight/ActionStage/Screen/View'

const SpotlightRoute = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path={ROUTE_PATHS.home} element={<ProtectedRoute component={Spotlight} />}>
          <Route index element={<ProtectedRoute component={Content} />} />
          <Route path="action" element={<ProtectedRoute component={PerformersContainer} />} />
          <Route path="action/view" element={<ProtectedRoute component={ViewPage} />} />
        </Route>
        <Route path={ROUTE_PATHS.login} element={<Login />} />
      </Routes>
      <GlobalListener />
      <Bubble />
      <GlobalStyle />
    </HashRouter>
  )
}

export default SpotlightRoute
