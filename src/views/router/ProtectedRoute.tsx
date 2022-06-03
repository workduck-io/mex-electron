import FullPageLoader from '@components/mex/FullPageLoader'
import { useLayoutStore } from '@store/useLayoutStore'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../services/auth/useAuth'
import { ROUTE_PATHS } from '../routes/urls'
import { MexRouteProps } from './AuthRoute'

const ProtectedRoute: React.FC<MexRouteProps> = ({ component: Component }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const showLoader = useLayoutStore((store) => store.showLoader)

  if (showLoader) return <FullPageLoader />

  if (!authenticated) {
    return <Navigate to={ROUTE_PATHS.login} />
  }

  return <Component />
}

export default ProtectedRoute
