import React from 'react'

import Modal from 'react-modal'
import { WrappedNodeSelect } from '../../../components/mex/NodeSelect/NodeSelect'
import useBlockStore, { ContextMenuActionType } from '../../../store/useBlockStore'
import { useLinks } from '../../../hooks/useLinks'
import {
  AnyObject,
  ELEMENT_PARAGRAPH,
  getNodes,
  getPlateSelectors,
  insertNodes,
  TNode,
  usePlateEditorRef
} from '@udecode/plate'
import { NodeEntry, Transforms } from 'slate'
import { useContentStore } from '../../../store/useContentStore'
import { IpcAction } from '../../../data/IpcAction'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { AppType } from '../../../hooks/useInitialize'
import { useNodes } from '../../../hooks/useNodes'
import { useApi } from '../../../apis/useSaveApi'
import { NodeEditorContent } from '../../../types/Types'
import { defaultContent } from '../../../data/Defaults/baseData'
import { mog } from '../../../utils/lib/helper'
import { generateTempId } from '../../../data/Defaults/idPrefixes'

const BlockModal = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)
  const isModalOpen = useBlockStore((store) => store.isModalOpen)
  const setIsModalOpen = useBlockStore((store) => store.setIsModalOpen)
  const setIsBlockMode = useBlockStore((store) => store.setIsBlockMode)

  const { addNode } = useNodes()
  const { saveDataAPI } = useApi()
  const editor = usePlateEditorRef()
  const { getUidFromNodeId } = useLinks()

  const toggleModal = () => {
    setIsModalOpen(undefined)
  }

  const getEditorBlocks = (): Array<NodeEntry<TNode<AnyObject>>> => {
    const blocks = Object.values(blocksFromStore)
    const editorBlockEntries = getNodes(editor, {
      at: [],
      match: (node) => blocks.find((block) => block.id === node.id),
      block: true
    })

    return Array.from(editorBlockEntries)
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
      if (selection && blocks.length === 1) Transforms.removeNodes(editor, { at: selection })
      else {
        blocks.forEach(([block, path], index) => {
          const at = path[0] - index === -1 ? 0 : path[0] - index
          Transforms.delete(editor, { at: [at] })
        })
      }
    }

    const isEmpty = editor.children.length === 0

    if (isEmpty)
      insertNodes(editor, { type: ELEMENT_PARAGRAPH, id: generateTempId(), children: [{ text: '' }] }, { at: [0] })
  }

  const onNodeCreate = (path: string): void => {
    const editorBlocks = getEditorBlocks()
    const blocksContent = getContentFromBlocks(path, editorBlocks, false)

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)

    addNode({ ilink: path, showAlert: true }, (node) => {
      saveDataAPI(node.nodeid, blocksContent)
      appNotifierWindow(IpcAction.NEW_RECENT_ITEM, AppType.MEX, node.nodeid)
    })
  }

  const onNodeSelect = (path: string) => {
    const nodeid = getUidFromNodeId(path)
    const editorBlocks = getEditorBlocks()
    const content = getContentFromBlocks(nodeid, editorBlocks)

    deleteContentBlocks(editorBlocks)
    setIsModalOpen(undefined)
    setIsBlockMode(false)

    saveDataAPI(nodeid, content)
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
