import { NodeContent } from '../../Types/data'
import { SourceType } from '../../Spotlight/components/Source/types'
import { useContentStore } from './ContentStore'
import { NodeProperties } from './EditorStore'
import { defaultContent } from '../../Defaults/baseData'

/** Get the contents of the node with id */
export function getContent(uid: string): NodeContent {
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  if (contents[uid]) {
    // const { content } = contents[uid]

    if (contents[uid]) {
      // console.log(JSON.stringify(apiData, null, 2), JSON.stringify(content, null, 2))
      return contents[uid]
    }
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
  key: '@',
  uid: '__null__'
})
