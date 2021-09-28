import { SourceType } from '../../Spotlight/components/Source/types'
import { EditorStateProps } from '../../Types/EditorContext'
import TreeNode from '../../Types/tree'
import { useContentStore } from './ContentStore'
import { NodeProperties } from './EditorStore'
import { NodeEditorContent } from './Types'

/** Get the contents of the node with id */
export function getContent (id: string): NodeEditorContent {
  // console.log('Loading ID', id);
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  if (contents[id]) {
    const { content } = contents[id]

    if (content) {
      return content
    }
  }

  return [{ children: [{ text: '' }] }]
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
