import BlockModal from '../../editor/Components/Blocks/BlockModal'
import Delete from '../mex/Refactor/DeleteModal'
import HelpModal from '../mex/Help/HelpModal'
import Lookup from '../mex/Lookup'
import React from 'react'
import Refactor from '../mex/Refactor/Refactor'
import Rename from '../mex/Refactor/Rename'
import { useAuthStore } from '@services/auth/useAuth'
import CreateReminderModal from '../mex/Reminders/CreateReminderModal'
import ShareModal from '@components/mex/Mention/ShareModal'
import ReleaseNotesModal from '@components/mex/ReleaseNotes'
import TaskViewModal from '@components/mex/TaskViewModal'

export interface ModalOpenAction {
  type: 'share-invite-prefill'
  data: any
}

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
      <ShareModal />
      <ReleaseNotesModal />
      <CreateReminderModal />
      <TaskViewModal />
    </>
  )
}

export default Modals

export const SpotlightModals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)

  if (!isAuthenticated) return <></>
  return (
    <>
      <ShareModal />
    </>
  )
}
