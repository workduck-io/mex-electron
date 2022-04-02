// import { FileData, NodeSearchData } from '../Types/data'

import { indexNames, diskIndex } from '../../data/search'
import { useContentStore } from '../../store/useContentStore'
import { useEditorStore } from '../../store/useEditorStore'
import { FileData } from '../../types/data'
import { getBlocks, getContent } from '../helpers'
import { mog } from '../lib/helper'
import { GenericSearchData, idxKey } from './../../types/search'
import { ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (content: any[], join?: string, exclude = [ELEMENT_EXCALIDRAW]): string => {
  const text: string[] = []

  content?.forEach((n) => {
    if (exclude.includes(n.type)) return

    if (n.text && n.text !== '') text.push(n.text)
    if (n.value && n.value !== '') text.push(n.value)
    if (n.url && n.url !== '') text.push(n.url)
    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children, join ?? '')
      text.push(childText)
    }
  })

  const rawText = text.join(join ?? '')
  return rawText
}

export const getBlock = (nodeid: string, blockId: string) => {
  const nodeContent = useContentStore.getState().getContent(nodeid)

  if (nodeContent?.content) {
    const blocksMap = getBlocks(nodeContent.content)
    if (blocksMap) {
      const blocks = Object.values(blocksMap).map((bd) => bd.block)
      if (!blocks) return undefined

      return blocks.find((b) => {
        return b?.id === blockId
      })
    }
  }

  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEntryToRawText = (nodeUID: string, entry: any[], title = ''): GenericSearchData => {
  return { id: nodeUID, title, text: convertContentToRawText(entry, ' ') }
}

export const parseNode = (nodeId: string, contents: any[], title = ''): GenericSearchData[] => {
  const result: GenericSearchData[] = []
  contents.forEach((block) => {
    if (block.type === ELEMENT_EXCALIDRAW) return

    let blockText = ''
    if (block.value && block.value !== '') blockText += `${block.value}`
    if (block.url && block.url !== '') blockText += ` ${block.url}`
    blockText += ' ' + convertContentToRawText(block.children, ' ')

    if (blockText.trim().length !== 0) {
      const temp: GenericSearchData = { id: nodeId, text: blockText, blockId: block.id, title: title, data: block }
      result.push(temp)
    }
  })
  return result
}

export const convertDataToIndexable = (data: FileData) => {
  const nodeBlockMap: { [key: string]: string[] } = {}
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
          if (!nodeBlockMap[k]) nodeBlockMap[k] = []
          v.content.forEach((block) => {
            const blockText = convertContentToRawText(block.children, ' ')
            if (blockText.length !== 0) {
              nodeBlockMap[k].push(block.id)
              const temp: GenericSearchData = {
                id: k,
                text: blockText,
                blockId: block.id,
                title: titleNodeMap.get(k),
                data: block
              }
              idxResult.push(temp)
            }
          })
        }
      })
    } else if (idxName === indexNames.snippet) {
      data.snippets.map((snip) => {
        const temp: GenericSearchData = convertEntryToRawText(snip.id, snip.content)
        temp.title = titleNodeMap.get(snip.id)
        nodeBlockMap[snip.id] = [snip.id] // Redundant right now, not doing block level indexing for snippets
        idxResult.push(temp)
      })
    } else {
      throw new Error('No corresponding index name found')
    }

    return { ...p, [idxName]: idxResult }
  }, diskIndex)

  // const dump = JSON.stringify(result)
  // mog('ConvertDataToIndexable', { dump, blockNodeMap })

  return { result, nodeBlockMap }
}
