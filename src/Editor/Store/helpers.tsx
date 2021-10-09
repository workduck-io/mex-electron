import { getDataAPI } from '../../Requests/Save'
import { SourceType } from '../../Spotlight/components/Source/types'
import { useContentStore } from './ContentStore'
import { NodeProperties } from './EditorStore'
import { NodeEditorContent } from './Types'

/** Get the contents of the node with id */
export async function getContent (uid: string): Promise<NodeEditorContent> {
  // console.log('Loading ID', id);
  // create a hashmap with id vs content
  // load the content from hashmap

  const { contents } = useContentStore.getState()

  const apiData = await getDataAPI(uid).catch((e) => {
    console.log('Content not found in API, using Local')
  })

  if (apiData) {
    return apiData
  }

  if (contents[uid]) {
    const { content } = contents[uid]

    if (content) {
      // console.log(JSON.stringify(apiData, null, 2), JSON.stringify(content, null, 2))
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
  title: 'test',
  id: 'test',
  key: 'test',
  uid: '__null__'
})
