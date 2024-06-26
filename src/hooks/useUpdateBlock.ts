import { findNodePath, getPlateEditorRef, setNodes } from '@udecode/plate'

import { useContentStore } from '@store/useContentStore'
import { useBufferStore } from './useEditorBuffer'
import { useUpdater } from './useUpdater'

type BlockDataType = Record<string, any>

const useUpdateBlock = () => {
  const addInBuffer = useBufferStore((b) => b.add)
  const { updateFromContent } = useUpdater()

  /*
    Update block's data in an Editor using element. 

    This is used when component isn't a part of Editor
  */
  const insertInEditor = (blockElement: any, blockData: BlockDataType) => {
    const editor = getPlateEditorRef()

    if (editor) {
      const path = findNodePath(editor, blockElement)
      setNodes(editor, blockData, { at: path })
    }
  }

  /*
    Update block's data inside a Note. 

    Use this if you can't access editor directly. For eg, in Tasks view to update status of a task.
  */
  const setInfoOfBlockInContent = (
    noteId: string,
    options: {
      blockId: string
      blockData: BlockDataType
      useBuffer: boolean
    }
  ) => {
    const bufferContent = useBufferStore.getState().getBuffer(noteId)
    const existingContent = useContentStore.getState().getContent(noteId)?.content

    const content = bufferContent || existingContent

    const updateInBuffer = options.useBuffer !== false

    if (content?.length > 0) {
      const updatedContent = content.map((block) => {
        if (block.id === options.blockId) {
          return {
            ...block,
            ...options.blockData
          }
        }

        return block
      })

      if (updateInBuffer) {
        addInBuffer(noteId, updatedContent)

        return
      }
    }
  }

  const addBlockInContent = (noteId: string, block: BlockDataType) => {
    const bufferContent = useBufferStore.getState().getBuffer(noteId)
    const existingContent = useContentStore.getState().getContent(noteId)?.content

    const content = bufferContent || existingContent

    if (content?.length > 0) {
      const updatedContent = [...content, ...(block as any)]
      updateFromContent(noteId, updatedContent)
    }
  }

  return {
    insertInEditor,
    setInfoOfBlockInContent,
    addBlockInContent
  }
}

export default useUpdateBlock
