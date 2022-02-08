import unarchiveLine from '@iconify-icons/clarity/unarchive-line'
import trashIcon from '@iconify-icons/codicon/trash'
import archiveFill from '@iconify-icons/ri/archive-fill'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Modal from 'react-modal'
import { useHistory } from 'react-router'
import { useTransition } from 'react-spring'
import styled, { useTheme } from 'styled-components'
import { ModalControls, ModalHeader, MRMHead } from '../../components/mex/Refactor/styles'
import { defaultContent } from '../../data/Defaults/baseData'
import { useSaver } from '../../editor/Components/Saver' // FIXME move useSaver to hooks
import EditorPreviewRenderer from '../../editor/EditorPreviewRenderer'
import useArchive from '../../hooks/useArchive'
import useLoad from '../../hooks/useLoad'
import { useContentStore } from '../../store/useContentStore'
import useDataStore from '../../store/useDataStore'
import { NodeProperties } from '../../store/useEditorStore'
import { Button } from '../../style/Buttons'
import { NotFoundText } from '../../style/Form'
import { IntegrationContainer, Title } from '../../style/Integration'
import { Result, ResultHeader, Results, ResultTitle, SearchPreviewWrapper } from '../../style/Search'
import { ILink } from '../../types/Types'

const Nodes = styled.section`
  padding-right: 2rem;
  height: 100%;
  width: 100%;
`

export const ArchivedNode = styled.div`
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
  padding: 0.4rem;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  :hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

const ActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const Archive = () => {
  const archive = useDataStore((store) => store.archive)
  const addILink = useDataStore((state) => state.addILink)

  const { unArchiveData, removeArchiveData, getArchiveData } = useArchive()
  const [delNode, setDelNode] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const { loadNode } = useLoad()
  const { onSave } = useSaver()
  const history = useHistory()
  const contents = useContentStore((store) => store.contents)
  const theme = useTheme()

  // * TODO: Uncomment this !important
  // useEffect(() => {
  //   getArchiveData()
  // }, [])

  const onUnarchiveClick = async (node: ILink) => {
    // const present = ilinks.find((link) => link.key === node.key)

    // if (present) {
    //   setShowModal(true)
    // }

    await unArchiveData([node])
    addILink(node.path, node.nodeid, undefined, true)

    const archiveNode: NodeProperties = {
      id: node.path,
      key: node.path,
      title: node.path,
      nodeid: node.nodeid
    }

    loadNode(node.nodeid, { savePrev: false, fetch: false, node: archiveNode })
  }

  const transition = useTransition(archive, {
    // sort: (a, b) => (a.score > b.score ? -1 : 0),
    keys: (item) => `archive_${item.nodeid}`,
    from: { opacity: 0 },
    enter: { opacity: 1 },
    trail: 50,
    duration: 200,
    config: {
      mass: 1,
      tension: 200,
      friction: 16
    }
  })

  const onDeleteClick = async () => {
    const nodesToDelete = archive.filter((i) => {
      const match = i.path.startsWith(delNode.path)
      return match
    })

    await removeArchiveData(nodesToDelete)

    // onSave()

    setShowModal(false)
  }

  const handleCancel = () => {
    setShowModal(false)
    setDelNode(undefined)
  }

  return (
    <IntegrationContainer>
      <Title>Archive</Title>
      <Nodes>
        {archive.length === 0 && (
          <NotFoundText>
            <Icon color={theme.colors.primary} fontSize={128} icon={archiveFill} />
            <p>Your archive is empty!</p>
          </NotFoundText>
        )}
        <Results>
          {transition((styles, n, _t, _i) => {
            const con = contents[n.nodeid]
            const path = n.path
            const content = con ? con.content : defaultContent.content
            return (
              <Result style={styles} key={`tag_res_prev_archive_${n.nodeid}${_i}`}>
                <ResultHeader>
                  <ResultTitle>{path}</ResultTitle>
                  <ActionContainer>
                    <StyledIcon
                      fontSize={32}
                      color={theme.colors.primary}
                      onClick={(ev) => {
                        ev.preventDefault()
                        onUnarchiveClick(n)
                      }}
                      icon={unarchiveLine}
                    />
                    <StyledIcon
                      fontSize={32}
                      color="#df7777"
                      onClick={(ev) => {
                        ev.preventDefault()
                        setDelNode(n)
                        setShowModal(true)
                      }}
                      icon={trashIcon}
                    />
                  </ActionContainer>
                </ResultHeader>
                <SearchPreviewWrapper>
                  <EditorPreviewRenderer content={content} editorId={`editor_archive_preview_${n.nodeid}`} />
                </SearchPreviewWrapper>
              </Result>
            )
          })}
        </Results>
        {/* {archive.map((node: ILink) => (
          <ArchivedNode key={node.nodeid}>
            <ArchiveHeader>{node.text}</ArchiveHeader>
            <ActionContainer>
              <StyledIcon fontSize={28} onClick={() => onUnarchiveClick(node)} icon={unarchiveLine} />
              <StyledIcon fontSize={28} color="#df7777" onClick={() => setDelNode(node)} icon={trashIcon} />
            </ActionContainer>
          </ArchivedNode>
        ))} */}
      </Nodes>
      <Modal
        className="ModalContent"
        overlayClassName="ModalOverlay"
        onRequestClose={() => setShowModal(false)}
        isOpen={showModal}
      >
        <ModalHeader>Archive</ModalHeader>
        <MRMHead>
          {!delNode && <h1>Node with same name is present in the workspace.</h1>}
          <p>Are you sure you want to {delNode ? 'delete' : 'replace'}?</p>
        </MRMHead>
        <ModalControls>
          <Button large onClick={handleCancel}>
            Cancel
          </Button>
          <Button large primary onClick={onDeleteClick}>
            {delNode ? 'Delete' : 'Replace'}
          </Button>
        </ModalControls>
      </Modal>
    </IntegrationContainer>
  )
}

export default Archive
