import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import { useAuthStore } from '../../services/auth/useAuth'

const ProtectedRoute = ({ component: Component, path }: RouteProps) => {
  const authenticated = useAuthStore((store) => store.authenticated)

  if (!authenticated) {
    return <Redirect to="/login" />
  }

  return <Route component={Component} path={path} />
}

export default ProtectedRoute
