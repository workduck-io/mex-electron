import { SourceType } from '../components/spotlight/Source/types'
import { defaultContent } from '../data/Defaults/baseData'
import { useContentStore } from '../store/useContentStore'
import { NodeProperties } from '../store/useEditorStore'
import { NodeContent } from '../types/data'
import { mog } from './lib/helper'

/** Get the contents of the node with id */
export function getContent(nodeid: string): NodeContent {
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  mog('getContent', { nodeid, contents, nodeidCon: contents[nodeid] })
  if (contents[nodeid] && contents[nodeid].content.length > 0) {
    return contents[nodeid]
  }
  return defaultContent
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
