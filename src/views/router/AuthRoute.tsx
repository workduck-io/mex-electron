import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../services/auth/useAuth'
import { useEditorStore } from '../../store/useEditorStore'
import { ROUTE_PATHS } from '../routes/urls'

export interface MexRouteProps {
  component: React.ComponentType
}

const AuthRoute: React.FC<MexRouteProps> = ({ component: Component }) => {
  const authenticated = useAuthStore((store) => store.authenticated)
  const nodeid = useEditorStore((store) => store.node.nodeid)

  if (authenticated) {
    return <Navigate to={`${ROUTE_PATHS.node}/${nodeid}`} />
  }

  return <Component />
}

export default AuthRoute
