import BlockModal from '../../editor/Components/Blocks/BlockModal'
import Delete from '../mex/Refactor/DeleteModal'
import HelpModal from '../mex/Help/HelpModal'
import Lookup from '../mex/Lookup'
import React, { useEffect } from 'react'
import Refactor from '../mex/Refactor/Refactor'
import Rename from '../mex/Refactor/Rename'
import { useAuthStore } from '@services/auth/useAuth'
import CreateReminderModal from '../mex/Reminders/CreateReminderModal'
import ShareModal from '@components/mex/Mention/ShareModal'
import { ipcRenderer } from 'electron'
import { IpcAction } from '@data/IpcAction'
import { mog } from '@utils/lib/helper'
import { useShareModalStore } from '@components/mex/Mention/ShareModalStore'

export interface ModalOpenAction {
  type: 'share-invite-prefill'
  data: any
}

const Modals = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  // const prefillShareModal = useShareModalStore((state) => state.prefillModal)

  // useEffect(() => {
  //   ipcRenderer.on(IpcAction.OPEN_MODAL, (_event, { type, data }) => {
  //     mog('open modal', { type, data })
  //     switch (type) {
  //       case 'share-invite-prefill': {
  //         prefillShareModal('invite', { alias: data.alias, nodeid: data.nodeid })
  //         break
  //       }
  //     }
  //   })
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
      <CreateReminderModal />
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
