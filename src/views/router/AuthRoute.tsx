import FullPageLoader from '@components/mex/FullPageLoader'
import { useLayoutStore } from '@store/useLayoutStore'
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../services/auth/useAuth'
import { useEditorStore } from '../../store/useEditorStore'
import { ROUTE_PATHS } from '../routes/urls'

export interface MexRouteProps {
  component: React.ComponentType
  redirectTo?: string
}

const AuthRoute: React.FC<MexRouteProps> = ({ component: Component, redirectTo }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const nodeid = useEditorStore((store) => store.node.nodeid)
  const showLoader = useLayoutStore((store) => store.showLoader)

  if (showLoader) return <FullPageLoader />

  if (authenticated) {
    return <Navigate to={redirectTo || `${ROUTE_PATHS.tasks}`} />
  }

  return <Component />
}

export default AuthRoute
