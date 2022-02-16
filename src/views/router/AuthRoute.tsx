import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuthStore } from '../../services/auth/useAuth'
import { ROUTE_PATHS } from '../routes/urls'

const AuthRoute = ({ component: Component, path }: RouteProps) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  if (authenticated) {
    return <Redirect to={ROUTE_PATHS.node} />
  }

  return <Route component={Component} path={path} />
}

export default AuthRoute
