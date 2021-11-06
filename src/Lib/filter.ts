import { NodeEditorContent } from './../Editor/Store/Types'
import { ELEMENT_INLINE_BLOCK } from './../Editor/Components/InlineBlock/types'
import { ELEMENT_SYNC_BLOCK } from './../Editor/Components/SyncBlock/SyncBlock.types'
import { useEditorStore } from './../Editor/Store/EditorStore'
import { useMemo } from 'react'

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
  const content = useEditorStore((state) => state.content)

  const elements = useMemo(() => {
    const data: NodeEditorContent = []
    filterContent(content, data, filter)
    return data
  }, [content])

  return { elements }
}
