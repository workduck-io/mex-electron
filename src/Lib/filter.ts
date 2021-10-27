import { ELEMENT_SYNC_BLOCK } from './../Editor/Components/SyncBlock/SyncBlock.types'
import { useEditorStore } from './../Editor/Store/EditorStore'

export const isSyncBlock = (type: string) => type === ELEMENT_SYNC_BLOCK

export const useFilteredContent = () => {
  const content = useEditorStore((state) => state.content)
  const syncBlocks: Array<string> = []

  const filteredContent = content.map((el) => {
    if (isSyncBlock(el.type)) {
      syncBlocks.push(el.id)
      return { text: '' }
    }

    const children = el.children.map((item) => {
      if (isSyncBlock(item.type)) syncBlocks.push(item.id)
      return { text: '' }
    })

    return { ...el, children }
  })

  return { syncBlocks }
}
