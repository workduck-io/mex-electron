import React from 'react'

import FleetContainer from '@components/FleetContainer'
import ShareModal from '@components/mex/Mention/ShareModal'
import ReleaseNotesModal from '@components/mex/ReleaseNotes'
import TaskViewModal from '@components/mex/TaskViewModal'
import TemplateModal from '@components/mex/Template/TemplateModal'
import { useAuthStore } from '@services/auth/useAuth'

import BlockModal from '../../editor/Components/Blocks/BlockModal'
import HelpModal from '../mex/Help/HelpModal'
import Lookup from '../mex/Lookup'
import Delete from '../mex/Refactor/DeleteModal'
import Rename from '../mex/Refactor/Rename'
import CreateReminderModal from '../mex/Reminders/CreateReminderModal'
import CreateTodoModal from '@components/Modals/CreateTodoModal'

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
      {/* <Refactor /> */}
      <Rename />
      <Delete />
      <HelpModal />
      <BlockModal />
      <ShareModal />
      <ReleaseNotesModal />
      <CreateReminderModal />
      <CreateTodoModal/>
      <TaskViewModal />
      <TemplateModal />
      <FleetContainer />
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
