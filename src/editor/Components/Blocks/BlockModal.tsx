import { AnyObject, ELEMENT_PARAGRAPH, TNode, getNodes, insertNodes, usePlateEditorRef } from '@udecode/plate'
import { NodeEntry, Transforms } from 'slate'
import { QuickLink, WrappedNodeSelect } from '../../../components/mex/NodeSelect/NodeSelect'
import useBlockStore, { BlockMetaDataType, ContextMenuActionType } from '../../../store/useBlockStore'

import { Button } from '../../../style/Buttons'
import Modal from 'react-modal'
import { NodeEditorContent } from '../../../types/Types'
import React from 'react'
import { defaultContent } from '../../../data/Defaults/baseData'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import { mog } from '../../../utils/lib/helper'
import { updateIds } from '../../../utils/dataTransform'
import { useContentStore } from '../../../store/useContentStore'
import { useDataSaverFromContent, useSaver } from '../Saver'
import { useLinks } from '../../../hooks/useLinks'
import { ButtonWrapper } from '../../../style/Settings'
import { useCreateNewNote } from '@hooks/useCreateNewNote'
import { useEditorStore } from '@store/useEditorStore'

export const getBlockMetadata = (text: string, meta?: BlockMetaDataType): BlockMetaDataType => {
  const metadata = meta || {}

  // * Origin of the block
  if (!metadata?.origin) return { ...metadata, source: text, origin: text }

  return { ...metadata, source: text }
}

const BlockModal = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)
  const isModalOpen = useBlockStore((store) => store.isModalOpen)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const { createNewNote } = useCreateNewNote()
  const { onSave } = useSaver()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  const editor = usePlateEditorRef()
  const { getNodeidFromPath } = useLinks()

  const toggleModal = () => {
    setIsModalOpen(undefined)
  }

  const getEditorBlocks = (): Array<NodeEntry<TNode<AnyObject>>> => {
    const nodeId = useEditorStore.getState().node.nodeid

    const blocks = Object.values(blocksFromStore)
    const blockIter = getNodes(editor, {
      at: [],
      match: (node) => {
        return blocks.find((block) => {
          return block.id === node.id
        })
      },
      block: true
    })

    const blockEnteries = Array.from(blockIter).map(([block, _path]) => {
      const blockWithMetadata = { ...block, blockMeta: getBlockMetadata(nodeId, block?.blockMeta) }
      mog('Block enteries are', { blockWithMetadata })

      return [updateIds(blockWithMetadata), _path]
    })

    return blockEnteries as NodeEntry<TNode<AnyObject>>[]
  }

  const getContentFromBlocks = (
    nodeid: string,
    blocks: NodeEntry<TNode<AnyObject>>[],
    isAppend = true
  ): NodeEditorContent => {
    const blocksContent = blocks.map(([block, _path]) => block)

    if (!isAppend) return blocksContent

    const content = useContentStore.getState().getContent(nodeid)
    return [...(content?.content ?? defaultContent.content), ...blocksContent]
  }

  const deleteContentBlocks = (blocks: NodeEntry<TNode<AnyObject>>[]): void => {
    const selection = editor?.selection
    const moveAction =
      isModalOpen === ContextMenuActionType.move /* Move content blocks */ ||
      isModalOpen === ContextMenuActionType.del /* Delete content blocks */

    if (moveAction) {
      if (blocks.length) {
        blocks.forEach(([block, path], index) => {
          const at = path[0] - index === -1 ? 0 : path[0] - index
          Transforms.delete(editor, { at: [at] })
        })
      } else if (selection) {
        Transforms.removeNodes(editor, { at: selection })
      }
    }

    const isEmpty = editor.children.length === 0

    if (isEmpty)
      insertNodes(editor, { type: ELEMENT_PARAGRAPH, id: generateTempId(), children: [{ text: '' }] }, { at: [0] })
  }

  const onBlockDelete = (): any => {
    const editorBlocks = getEditorBlocks()

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)

    return editorBlocks
  }

  const onCancel = (): void => {
    setIsModalOpen(undefined)
    setIsBlockMode(false)
  }

  const onNodeCreate = (quickLink: QuickLink): void => {
    const editorBlocks = onBlockDelete()
    const blocksContent = getContentFromBlocks(quickLink.value, editorBlocks, false)
    createNewNote({ path: quickLink.value, noteContent: blocksContent })
  }

  const onNodeSelect = (quickLink: QuickLink) => {
    const nodeid = getNodeidFromPath(quickLink.value)
    const editorBlocks = onBlockDelete()
    const content = getContentFromBlocks(nodeid, editorBlocks)

    saveEditorValueAndUpdateStores(nodeid, content)
  }

  const length = Object.values(blocksFromStore).length

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={toggleModal} isOpen={!!isModalOpen}>
      {length ? (
        isModalOpen === ContextMenuActionType.del ? (
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
          </>
        ) : (
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
        )
      ) : (
        <h1>Select Blocks</h1>
      )}
    </Modal>
  )
}

export default BlockModal
