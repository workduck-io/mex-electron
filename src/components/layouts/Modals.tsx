import React from 'react'
import { useAuthStore } from '../../services/auth/useAuth'
import HelpModal from '../mex/Help/HelpModal'
import Lookup from '../mex/Lookup'
import Delete from '../mex/Refactor/DeleteModal'
import Refactor from '../mex/Refactor/Refactor'
import Rename from '../mex/Refactor/Rename'

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  if (!isAuthenticated) return <></>
  return (
    <>
      <Lookup />
      <Refactor />
      <Rename />
      <Delete />
      <HelpModal />
    </>
  )
}

export default Modals
