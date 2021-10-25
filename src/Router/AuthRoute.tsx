import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuthStore } from '../Hooks/useAuth/useAuth'

const AuthRoute = ({ component: Component, path }: RouteProps) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  if (authenticated) {
    return <Redirect to="/editor" />
  }

  return <Route component={Component} path={path} />
}

export default AuthRoute
