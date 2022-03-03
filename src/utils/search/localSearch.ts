// import { FileData, NodeSearchData } from '../Types/data'

import { FileData, GenericSearchData, NodeSearchData } from '../../types/data'
import { mog } from '../lib/helper'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (content: any[], join?: string): string => {
  const text: string[] = []
  content.forEach((n) => {
    if (n.text && n.text !== '') text.push(n.text)
    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children, join ?? '')
      text.push(childText)
    }
  })
  const rawText = text.join(join ?? '')
  // mog('Rawtext', { content, rawText })
  return rawText
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEntryToRawText = (nodeUID: string, entry: any[], title = ''): GenericSearchData => {
  return { id: nodeUID, title, text: convertContentToRawText(entry, ' ') }
}

export const convertDataToRawText = (data: FileData): GenericSearchData[] => {
  const result: GenericSearchData[] = []
  const titleNodeMap = new Map<string, string>()
  data.ilinks.forEach((entry) => {
    titleNodeMap.set(entry.nodeid, entry.path)
  })

  Object.entries(data.contents).forEach(([k, v]) => {
    if (v.type === 'editor' && k !== '__null__') {
      const temp: GenericSearchData = convertEntryToRawText(k, v.content)
      temp.title = titleNodeMap.get(k)
      result.push(temp)
    }
  })

  return result
}
