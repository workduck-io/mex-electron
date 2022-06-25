import { SourceType } from '../components/spotlight/Source/types'
import { defaultContent } from '../data/Defaults/baseData'
import { useContentStore } from '../store/useContentStore'
import { NodeProperties } from '../store/useEditorStore'
import { NodeContent } from '../types/data'
import { NodeEditorContent } from '../types/Types'
import { convertContentToRawText } from './search/parseData'

/** Get the contents of the node with id */
export function getContent(nodeid: string): NodeContent {
  // create a hashmap with id vs content
  // load the content from hashmap

  const contents = useContentStore.getState().contents
  const noteContent = contents?.[nodeid]
  // mog('getContent', { nodeid, contents, nodeidCon: contents[nodeid] })
  if (noteContent?.content?.length > 0) {
    return noteContent
  }
  return defaultContent
}

// Inclusive
export const randomNumberBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export const getBlocks = (content: NodeEditorContent): Record<string, any> | undefined => {
  if (content) {
    const blocks: Record<string, any> = {}
    let insertOp = false

    content.map((block) => {
      if (block.id) {
        if (!insertOp) insertOp = true
        const desc = convertContentToRawText(block.children)
        blocks[block.id] = { block, desc }
      }
    })

    if (insertOp) return blocks
  }

  return undefined
}

export const isFromSameSource = (oldSource: SourceType, newSource: SourceType): boolean => {
  if (oldSource.url === newSource.url) {
    if (oldSource.url === '#') {
      const oldSourceAppName = oldSource.children[0].text
      const newSourceAppName = newSource.children[0].text

      return oldSourceAppName === newSourceAppName
    }

    return true
  }

  return false
}

export const getInitialNode = (): NodeProperties => ({
  title: '@',
  id: '@',
  path: '@',
  nodeid: '__null__'
})

export const typeInvert = (type: string) => (type === 'from' ? 'to' : 'from')

// Returns an array of unique values via Set
export const Settify = <T,>(arr: T[]): T[] => Array.from(new Set(arr))
