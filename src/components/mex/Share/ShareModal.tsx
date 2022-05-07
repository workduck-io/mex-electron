import React, { useEffect } from 'react'
import Modal from 'react-modal'
import tinykeys from 'tinykeys'
import create from 'zustand'
import { useNavigation } from '../../../hooks/useNavigation'
import { useKeyListener } from '../../../hooks/useShortcutListener'
import { useHelpStore } from '../../../store/useHelpStore'
import { Button } from '../../../style/Buttons'
import { ModalControls, ModalHeader } from '../Refactor/styles'
import { SharedPermissionsWrapper, ShareRow } from './styles'

interface ShareModalState {
  open: boolean
  focus: boolean
  openModal: () => void
  closeModal: () => void
  setFocus: (focus: boolean) => void
  prefillModal: () => void
}

export const useShareModalStore = create<ShareModalState>((set) => ({
  open: false,
  focus: true,
  openModal: () =>
    set({
      open: true
    }),
  closeModal: () => {
    set({
      open: false,
      focus: false
    })
  },
  setFocus: (focus: boolean) => set({ focus }),
  prefillModal: () =>
    set({
      open: true,
      focus: false
    })
}))

const ShareModal = () => {
  const open = useShareModalStore((store) => store.open)
  const focus = useShareModalStore((store) => store.focus)
  const closeModal = useShareModalStore((store) => store.closeModal)
  // const openModal = useShareModalStore((store) => store.openModal)

  // const shortcuts = useHelpStore((store) => store.shortcuts)
  // const { push } = useNavigation()
  // const { shortcutDisabled, shortcutHandler } = useKeyListener()

  // TODO: Add Share Modal shortcut
  // useEffect(() => {
  //   const unsubscribe = tinykeys(window, {
  //     [shortcuts.showShareModal.keystrokes]: (event) => {
  //       event.preventDefault()
  //       shortcutHandler(shortcuts.showShareModal, () => {
  //         openModal()
  //       })
  //     }
  //   })
  //   return () => {
  //     unsubscribe()
  //   }
  // }, [shortcuts, shortcutDisabled])

  const handleCopyLink = () => {
    closeModal()
  }

  const handleSave = () => {
    closeModal()
  }

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      <ModalHeader>Share Note</ModalHeader>

      <SharedPermissionsWrapper>
        <ShareRow>Mr Dank</ShareRow>
        <ShareRow>Mr Stank</ShareRow>
      </SharedPermissionsWrapper>

      <ModalControls>
        <Button large onClick={handleCopyLink}>
          Copy Link
        </Button>
        <Button primary autoFocus={!focus} large onClick={handleSave}>
          Save
        </Button>
      </ModalControls>
    </Modal>
  )
}

export default ShareModal
