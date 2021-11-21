import React, { useState } from 'react'
import unarchiveLine from '@iconify-icons/clarity/unarchive-line'
import trashIcon from '@iconify-icons/codicon/trash'
import useArchive from '../Hooks/useArchive'
import styled from 'styled-components'
import { IntegrationContainer, Title } from '../Styled/Integration'
import useDataStore from '../Editor/Store/DataStore'
import { ILink } from '../Editor/Store/Types'
import { Icon } from '@iconify/react'
import useLoad from '../Hooks/useLoad/useLoad'
import { useNavigation } from '../Hooks/useNavigation/useNavigation'
import { useHistory } from 'react-router'
import { Button } from '../Styled/Buttons'
import { useSaver } from '../Editor/Components/Saver'
import Modal from 'react-modal'
import { ModalControls, ModalHeader, MRMHead } from '../Components/Refactor/styles'

const Nodes = styled.section`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  width: 100%;
`

const ArchivedNode = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  width: 16rem;
  height: 8rem;
  margin: 1rem;
  background-color: ${({ theme }) => theme.colors.background.card};
`

const ArchiveHeader = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  /* background-color: ${({ theme }) => theme.colors.background.card}; */
  overflow-x: hidden;
  padding: 1rem;
  font-size: 1.3rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* color: ${({ theme }) => theme.colors.primary}; */
`

const StyledIcon = styled(Icon)`
  cursor: pointer;
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  :hover {
    background-color: ${({ theme }) => theme.colors.background.highlight};
  }
`

const ActionContainer = styled.div`
  margin: 1rem;
  display: flex;
  justify-content: space-between;
`

const Archive = () => {
  const archive = useDataStore((store) => store.archive)
  const ilinks = useDataStore((state) => state.ilinks)
  const { unarchive, removeFromArchive } = useArchive()
  const [delNode, setDelNode] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const { loadNode } = useLoad()
  const { onSave } = useSaver()
  const history = useHistory()

  // useEffect(() => {
  //   getArchive()
  // }, [])

  const onUnarchiveClick = (node: ILink) => {
    history.push('/editor')
    unarchive([node])

    const present = ilinks.find((link) => link.key === node.key)

    if (present) {
      setShowModal(true)
    }

    loadNode(node.uid, true, false)
  }

  const onDeleteClick = () => {
    const nodesToDelete = archive.filter((i) => {
      const match = i.key.startsWith(delNode.key)
      return match
    })

    removeFromArchive(nodesToDelete)
    onSave()
  }

  const handleCancel = () => {
    setDelNode(undefined)
  }

  return (
    <IntegrationContainer>
      <Title>Archived</Title>
      <Nodes>
        {archive.map((node: ILink) => (
          <ArchivedNode key={node.uid}>
            <ArchiveHeader>{node.text}</ArchiveHeader>
            <ActionContainer>
              <StyledIcon fontSize={28} onClick={() => onUnarchiveClick(node)} icon={unarchiveLine} />
              <StyledIcon fontSize={28} color="#df7777" onClick={() => setDelNode(node)} icon={trashIcon} />
            </ActionContainer>
          </ArchivedNode>
        ))}
      </Nodes>
      <Modal
        className="ModalContent"
        overlayClassName="ModalOverlay"
        onRequestClose={() => setShowModal(false)}
        isOpen={showModal}
      >
        <ModalHeader>Archive</ModalHeader>
        <MRMHead>
          <h1>Node with same name is present in the workspace.</h1>
          <p>Are you sure you want to replace?</p>
        </MRMHead>
        <ModalControls>
          <Button large primary onClick={onDeleteClick}>
            Replace
          </Button>
          <Button large onClick={handleCancel}>
            Cancel Culture
          </Button>
        </ModalControls>
      </Modal>
    </IntegrationContainer>
  )
}

export default Archive
