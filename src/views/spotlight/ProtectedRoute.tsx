import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../services/auth/useAuth'
import { MexRouteProps } from '../router/AuthRoute'
import { ROUTE_PATHS } from '../routes/urls'

const ProtectedRoute: React.FC<MexRouteProps> = ({ component: Component }) => {
  const authenticated = useAuthStore((store) => store.authenticated)

  if (!authenticated) {
    return <Navigate to={ROUTE_PATHS.login} />
  }

  return <Component />
}

export default ProtectedRoute
