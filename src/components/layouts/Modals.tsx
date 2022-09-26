import React from 'react'

import FleetContainer from '@components/FleetContainer'
import ShareModal from '@components/mex/Mention/ShareModal'
import PreviewNoteModal from '@components/mex/PreviewNoteModal'
import ReleaseNotesModal from '@components/mex/ReleaseNotes'
import TaskViewModal from '@components/mex/TaskViewModal'
import CreateTodoModal from '@components/mex/Tasks/CreateTodoModal'
import TemplateModal from '@components/mex/Template/TemplateModal'
import { useAuthStore } from '@services/auth/useAuth'

import BlockModal from '../../editor/Components/Blocks/BlockModal'
import HelpModal from '../mex/Help/HelpModal'
import Lookup from '../mex/Lookup'
import Delete from '../mex/Refactor/DeleteModal'
import Refactor from '../mex/Refactor/Refactor'
import Rename from '../mex/Refactor/Rename'
import CreateReminderModal from '../mex/Reminders/CreateReminderModal'

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
      <PreviewNoteModal />
      <CreateTodoModal />
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
