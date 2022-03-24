import BlockModal from '../../editor/Components/Blocks/BlockModal'
import Delete from '../mex/Refactor/DeleteModal'
import HelpModal from '../mex/Help/HelpModal'
import Lookup from '../mex/Lookup'
import React from 'react'
import Refactor from '../mex/Refactor/Refactor'
import Rename from '../mex/Refactor/Rename'
import { useAuthStore } from '../../services/auth/useAuth'
import CreateReminderModal from '../mex/Reminders/CreateReminderModal'

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
      <BlockModal />
      <CreateReminderModal />
    </>
  )
}

export default Modals
