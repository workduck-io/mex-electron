import React from 'react'

import { QuickLink, WrappedNodeSelect } from '@components/mex/NodeSelect/NodeSelect'
import { useEditorBlockSelection } from '@editor/Actions/useEditorBlockSelection'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useLinks } from '@hooks/useLinks'
import { useNamespaces } from '@hooks/useNamespaces'
import useBlockStore from '@store/useBlockStore'
import Modal from 'react-modal'

import { useDataSaverFromContent } from '../Saver'

const BlockModal = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)
  const isModalOpen = useBlockStore((store) => store.isModalOpen)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)

  const { createNewNote } = useCreateNewNote()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  const { getNodeidFromPath } = useLinks()
  const { getDefaultNamespaceId } = useNamespaces()

  const { getContentWithNewBlocks, deleteSelectedBlock } = useEditorBlockSelection()

  const toggleModal = () => {
    setIsModalOpen(undefined)
  }

  const onNodeCreate = (quickLink: QuickLink): void => {
    const editorBlocks = deleteSelectedBlock()
    const blocksContent = getContentWithNewBlocks(quickLink.value, editorBlocks, false)
    createNewNote({ path: quickLink.value, noteContent: blocksContent, namespace: quickLink.namespace })
    setIsModalOpen(undefined)
  }

  const onNodeSelect = (quickLink: QuickLink) => {
    const nodeid = getNodeidFromPath(quickLink.value, quickLink.namespace)
    const editorBlocks = deleteSelectedBlock()
    const content = getContentWithNewBlocks(nodeid, editorBlocks)
    const namespace = quickLink.namespace ?? getDefaultNamespaceId()

    saveEditorValueAndUpdateStores(nodeid, namespace, content)
    setIsModalOpen(undefined)
  }

  const length = Object.values(blocksFromStore).length

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={toggleModal} isOpen={!!isModalOpen}>
      {length ? (
        /*isModalOpen === ContextMenuActionType.del ? (
          <>
            <h1>{`${isModalOpen}`}</h1>
            <p>{`Are you sure you want to delete ${length} block(s)?`}</p>
            <ButtonWrapper>
              <Button large onClick={onCancel}>
                Cancel
              </Button>
              <Button primary large onClick={() => onBlockDelete()}>
                Delete
              </Button>
            </ButtonWrapper>
            <br />
          </>*/

        <>
          <h1>{`${isModalOpen}  to`}</h1>
          <WrappedNodeSelect
            disallowReserved
            autoFocus
            menuOpen
            handleCreateItem={onNodeCreate}
            handleSelectItem={onNodeSelect}
          />
        </>
      ) : (
        <h1>Select Blocks</h1>
      )}
    </Modal>
  )
}

export default BlockModal
