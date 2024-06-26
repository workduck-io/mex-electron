// import { NodeEditorContent } from './../Editor/Store/Types'
// import { ELEMENT_INLINE_BLOCK } from './../Editor/Components/InlineBlock/types'
// import { ELEMENT_SYNC_BLOCK } from './../Editor/Components/SyncBlock/SyncBlock.types'
// import { useEditorStore } from './../Editor/Store/EditorStore'
import { useMemo } from 'react'
import { ELEMENT_INLINE_BLOCK } from '../../editor/Components/InlineBlock/types'
import { NodeEditorContent } from '../../types/Types'
import { ELEMENT_SYNC_BLOCK } from '../../editor/Components/SyncBlock'
import { useEditorStore } from '../../store/useEditorStore'
import { TodoStatus, TodoType } from '../../editor/Components/Todo/types'
import { useEditorBuffer } from '@hooks/useEditorBuffer'

export type ContentBlockType = typeof ELEMENT_SYNC_BLOCK | typeof ELEMENT_INLINE_BLOCK

export type FilterContentType = {
  filter?: string
  type: ContentBlockType
}

export const filterContent = (content: NodeEditorContent, blocks: NodeEditorContent, filter) => {
  content.forEach((element) => {
    if (element.type === filter.type) {
      blocks.push(element)
    }

    if (element.children && element.children.length > 0) {
      filterContent(element.children, blocks, filter)
    }
  })
}

export const useFilteredContent = (filter: FilterContentType) => {
  const nodeid = useEditorStore((state) => state.node.id)
  const { getBufferVal } = useEditorBuffer()

  const elements = useMemo(() => {
    // TODO: Also use the content from content store
    // if the editor buffer is not populated with the content
    // Not done as this component is no longer being used
    const content = getBufferVal(nodeid)
    if (!content) return []
    const data: NodeEditorContent = []
    filterContent(content, data, filter)
    return data
  }, [nodeid])

  return { elements }
}

export const filterIncompleteTodos = (todo: TodoType) => {
  if (todo?.metadata?.status === TodoStatus.completed) {
    return false
  }
  return true
}
