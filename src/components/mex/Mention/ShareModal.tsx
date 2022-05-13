import React from 'react'
import Modal from 'react-modal'
import { InviteModalContent } from './InviteModal'
import { PermissionModalContent } from './PermissionModal'
import { useShareModalStore } from './ShareModalStore'

// interface PermissionModalContentProps { }

const ShareModal = () => {
  const open = useShareModalStore((store) => store.open)
  // const focus = useShareModalStore((store) => store.focus)
  const closeModal = useShareModalStore((store) => store.closeModal)
  const mode = useShareModalStore((store) => store.mode)
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

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={closeModal} isOpen={open}>
      {mode === 'invite' ? <InviteModalContent /> : <PermissionModalContent />}
    </Modal>
  )
}

export default ShareModal
