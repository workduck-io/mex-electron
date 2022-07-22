import { AnyObject, ELEMENT_PARAGRAPH, TNode, getNodes, insertNodes, usePlateEditorRef } from '@udecode/plate'
import { NodeEntry, Transforms } from 'slate'
import useBlockStore, { BlockMetaDataType, BlockType } from '@store/useBlockStore'
import { defaultContent } from '@data/Defaults/baseData'
import { generateTempId } from '@data/Defaults/idPrefixes'
import { updateIds } from '@utils/dataTransform'
import { useContentStore } from '@store/useContentStore'
import { useEditorStore } from '@store/useEditorStore'
import { mog } from '@utils/lib/helper'
import { NodeEditorContent } from '../../types/Types'

export const getBlockMetadata = (text: string, meta?: BlockMetaDataType): BlockMetaDataType => {
  const metadata = meta || {}

  // * Origin of the block
  if (!metadata?.origin) return { ...metadata, source: text, origin: text }

  return { ...metadata, source: text }
}

export const useEditorBlockSelection = () => {
  const blocksFromStore = useBlockStore((store) => store.blocks)
  const editor = usePlateEditorRef()

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

  const getContentWithNewBlocks = (
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

    if (blocks.length) {
      blocks.forEach(([block, path], index) => {
        const at = path[0] - index === -1 ? 0 : path[0] - index
        Transforms.delete(editor, { at: [at] })
      })
    } else if (selection) {
      Transforms.removeNodes(editor, { at: selection })
    }

    const isEmpty = editor.children.length === 0

    if (isEmpty)
      insertNodes(editor, { type: ELEMENT_PARAGRAPH, id: generateTempId(), children: [{ text: '' }] }, { at: [0] })
  }

  const deleteSelectedBlock = (): any => {
    const editorBlocks = getEditorBlocks()
    deleteContentBlocks(editorBlocks)
    return editorBlocks
  }

  const convertToBlocks = () => {
    const nodes = Array.from(
      getNodes(editor, {
        mode: 'highest',
        block: true,
        at: editor.selection
      })
    )

    const value = nodes.map(([node, _path]) => {
      return node
    })

    const blocks = value.reduce((prev: Record<string, BlockType>, current: BlockType) => {
      prev[current.id] = current
      return prev
    }, {})
    return blocks
  }

  return {
    getEditorBlocks,
    getContentWithNewBlocks,
    deleteContentBlocks,
    convertToBlocks,
    deleteSelectedBlock
  }
}
