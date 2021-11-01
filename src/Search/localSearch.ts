import { FileData, NodeSearchData } from '../Types/data'

import lunr from 'lunr-mutable-indexes'

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
    this.metadataWhitelist = ['position']

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
