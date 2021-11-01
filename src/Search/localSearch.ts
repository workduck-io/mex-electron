import Fuse from 'fuse.js'
import { FileData, NodeSearchData } from '../Types/data'

import lunr from 'lunr-mutable-indexes'

export function createFuse(initList: NodeSearchData[], overrideOptions?: Fuse.IFuseOptions<NodeSearchData>) {
  const options: Fuse.IFuseOptions<NodeSearchData> = {
    minMatchCharLength: 4,
    threshold: 0.4,
    keys: ['text'],
    shouldSort: true,
    includeScore: true,
    ignoreLocation: true,
    includeMatches: true,
    ignoreFieldNorm: true,
    ...overrideOptions
  }

  const fuse = new Fuse(initList, options)

  return fuse
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createLunrIndex = (initList: NodeSearchData[], indexData: any) => {
  if (indexData) {
    console.log('Using Prebuilt Index!')
    const index = lunr.Index.load(indexData)
    return index
  }

  const index = lunr(function () {
    this.ref('nodeUID')
    this.field('text')

    initList.forEach(function (doc) {
      this.add(doc)
    }, this)
  })
  return index
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEntryToRawText = (nodeUID: string, entry: any[]): NodeSearchData => {
  const text: string[] = []

  entry.forEach((n) => {
    if (n.text && n.text !== '') text.push(n.text)
    if (n.children && n.children.length > 0) {
      const { text: childText } = convertEntryToRawText(nodeUID, n.children)
      text.push(childText)
    }
  })
  return { nodeUID: nodeUID, text: text.join(' ') }
}

export const convertDataToRawText = (data: FileData): NodeSearchData[] => {
  const result: NodeSearchData[] = []
  Object.entries(data.contents).forEach(([k, v]) => {
    if (v.type === 'editor' && k !== '__null__') {
      const temp: NodeSearchData = convertEntryToRawText(k, v.content)
      result.push(temp)
    }
  })
  return result
}
