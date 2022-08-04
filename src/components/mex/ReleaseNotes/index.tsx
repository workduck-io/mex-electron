import React from 'react'
import Modal from 'react-modal'
import useModalStore, { ModalsType } from '@store/useModalStore'
import { ReleaseNote, StyledReleaseNoteWrapper } from './styled'

const RELEASE_NOTE_URL = 'https://mexit.workduck.io/share/NODE_DJffLJCAzWUfmwtigYeni'
const ReleaseNotesModal = () => {
  const open = useModalStore((store) => store.open)
  const toggleModal = useModalStore((store) => store.toggleOpen)

  const onRequestClose = (ev: React.MouseEvent | React.KeyboardEvent) => {
    toggleModal(ModalsType.releases)
  }

  // * Move condition to Modal component
  if (open === ModalsType.releases) {
    return (
      <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={onRequestClose} isOpen={!!open}>
        <StyledReleaseNoteWrapper>
          <ReleaseNote title="Release Notes" src={RELEASE_NOTE_URL} frameBorder="0" />
        </StyledReleaseNoteWrapper>
      </Modal>
    )
  }

  return <></>
}

export default ReleaseNotesModal
