// import { FileData, NodeSearchData } from '../Types/data'

import { indexNames, diskIndex } from '../../data/search'
import { FileData, GenericSearchData } from '../../types/data'
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

export const convertDataToIndexable = (data: FileData): Record<indexNames, GenericSearchData[]> => {
  const result: Record<indexNames, GenericSearchData[]> = Object.entries(indexNames).reduce((p, c) => {
    const idxResult = []
    const idxName = c[0]
    const titleNodeMap = new Map<string, string>()

    // Pre-process the data to get the title node map
    switch (idxName) {
      case indexNames.node: {
        data.ilinks.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
        })
        break
      }

      case indexNames.archive: {
        data.archive.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
        })
        break
      }

      case indexNames.snippet: {
        data.snippets.forEach((snippet) => {
          titleNodeMap.set(snippet.id, snippet.title)
        })
        break
      }

      default: {
        throw new Error('No corresponding index name found')
      }
    }

    // Process the filedata to get the indexable data
    if (idxName === indexNames.archive || idxName === indexNames.node) {
      Object.entries(data.contents).forEach(([k, v]) => {
        if (v.type === 'editor' && k !== '__null__' && titleNodeMap.has(k)) {
          const temp: GenericSearchData = convertEntryToRawText(k, v.content)
          temp.title = titleNodeMap.get(k)
          idxResult.push(temp)
        }
      })
    } else if (idxName === indexNames.snippet) {
      data.snippets.map((snip) => {
        const temp: GenericSearchData = convertEntryToRawText(snip.id, snip.content)
        temp.title = titleNodeMap.get(snip.id)
        idxResult.push(temp)
      })
    } else {
      throw new Error('No corresponding index name found')
    }

    return { ...p, [idxName]: idxResult }
  }, diskIndex)

  mog('ConvertDataToIndexable', { data, result })

  return result
}
