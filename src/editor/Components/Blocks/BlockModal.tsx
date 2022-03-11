import {
  AnyObject,
  ELEMENT_PARAGRAPH,
  TNode,
  getNodes,
  getPlateSelectors,
  insertNodes,
  usePlateEditorRef
} from '@udecode/plate'
import { NodeEntry, Transforms } from 'slate'
import { QuickLink, WrappedNodeSelect } from '../../../components/mex/NodeSelect/NodeSelect'
import useBlockStore, { ContextMenuActionType } from '../../../store/useBlockStore'

import { AppType } from '../../../hooks/useInitialize'
import { IpcAction } from '../../../data/IpcAction'
import Modal from 'react-modal'
import { NodeEditorContent } from '../../../types/Types'
import React from 'react'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { defaultContent } from '../../../data/Defaults/baseData'
import { generateTempId } from '../../../data/Defaults/idPrefixes'
import { mog } from '../../../utils/lib/helper'
import { updateIds } from '../../../utils/dataTransform'
import { useContentStore } from '../../../store/useContentStore'
import { useDataSaverFromContent } from '../Saver'
import { useLinks } from '../../../hooks/useLinks'
import { useNodes } from '../../../hooks/useNodes'

const BlockModal = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)
  const isModalOpen = useBlockStore((store) => store.isModalOpen)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const { addNode } = useNodes()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()
  const editor = usePlateEditorRef()
  const { getNodeidFromPath } = useLinks()

  const toggleModal = () => {
    setIsModalOpen(undefined)
  }

  const getEditorBlocks = (): Array<NodeEntry<TNode<AnyObject>>> => {
    const blocks = Object.values(blocksFromStore)
    const blockIter = getNodes(editor, {
      at: [],
      match: (node) => blocks.find((block) => block.id === node.id),
      block: true
    })

    const blockEnteries = Array.from(blockIter).map(([block, _path]) => {
      return [updateIds(block), _path]
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
    const moveAction = isModalOpen === ContextMenuActionType.move // * Move content blocks

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

  const onNodeCreate = (quickLink: QuickLink): void => {
    const editorBlocks = getEditorBlocks()
    const blocksContent = getContentFromBlocks(quickLink.value, editorBlocks, false)

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)

    addNode({ ilink: quickLink.value, showAlert: true }, (node) => {
      saveEditorValueAndUpdateStores(node.nodeid, blocksContent)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)
    })
  }

  const onNodeSelect = (quickLink: QuickLink) => {
    const nodeid = getNodeidFromPath(quickLink.value)
    const editorBlocks = getEditorBlocks()
    const content = getContentFromBlocks(nodeid, editorBlocks)

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)

    saveEditorValueAndUpdateStores(nodeid, content)
    mog('content length', { content: getPlateSelectors().value(), len: getPlateSelectors().value() })
  }

  const length = Object.values(blocksFromStore).length

  return (
    <Modal className="ModalContent" overlayClassName="ModalOverlay" onRequestClose={toggleModal} isOpen={!!isModalOpen}>
      {length ? (
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
