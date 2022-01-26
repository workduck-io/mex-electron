// import { FileData, NodeSearchData } from '../Types/data'

import { NodeSearchData, FileData } from '../../types/data'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (content: any[], join?: string): string => {
  const text: string[] = []
  content.forEach((n) => {
    if (n.text && n.text !== '') text.push(n.text)
    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children)
      text.push(childText)
    }
  })
  return text.join(join ?? '')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEntryToRawText = (nodeUID: string, entry: any[]): NodeSearchData => {
  return { nodeUID: nodeUID, title: '', text: convertContentToRawText(entry) }
}

export const convertDataToRawText = (data: FileData): NodeSearchData[] => {
  const result: NodeSearchData[] = []
  const titleNodeMap = new Map<string, string>()
  data.ilinks.forEach((entry) => {
    titleNodeMap.set(entry.uid, entry.nodeId)
  })

  Object.entries(data.contents).forEach(([k, v]) => {
    if (v.type === 'editor' && k !== '__null__') {
      const temp: NodeSearchData = convertEntryToRawText(k, v.content)
      temp.title = titleNodeMap.get(k)
      result.push(temp)
    }
  })
  return result
}
