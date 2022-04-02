import { Document } from 'flexsearch'

import { FileData } from '../../types/data'
import { diskIndex, indexNames } from '../../data/search'
import { convertDataToIndexable } from './parseData'
import { SearchIndex, GenericSearchData } from '../../types/search'
import { mog } from '../lib/helper'
export interface CreateSearchIndexData {
  node: GenericSearchData[] | null
  snippet: GenericSearchData[] | null
  archive: GenericSearchData[] | null
}

export const createIndexCompositeKey = (nodeId: string, blockId: string) => {
  return `${nodeId}#${blockId}`
}

export const getNodeAndBlockIdFromCompositeKey = (compositeKey: string) => {
  const c = compositeKey.split('#')
  return { nodeId: c[0], blockId: c[1] }
}

export const createSearchIndex = (fileData: FileData, data: CreateSearchIndexData) => {
  // TODO: Find a way to delay the conversion until needed i.e. if index is not present
  const { result: initList, nodeBlockMap: nbMap } = convertDataToIndexable(fileData)

  const idx = Object.entries(indexNames).reduce((p, c) => {
    const idxName = c[0]
    const options = {
      document: {
        id: 'blockId',
        tag: 'tag',
        index: ['title', 'text'],
        store: ['text', 'data']
      },
      tokenize: 'full'
    }
    return { ...p, [idxName]: createGenricSearchIndex(initList[idxName], data[idxName] ?? null, options) }
  }, diskIndex)

  return { idx, nbMap }
}

export const flexIndexKeys = [
  'title.cfg',
  'title.ctx',
  'title.map',
  'text.cfg',
  'text.ctx',
  'text.map',
  'reg',
  'store',
  'tag'
]

export const createGenricSearchIndex = (
  initList: GenericSearchData[],
  indexData: any,
  // Default options for node search
  options: any = {
    document: {
      id: 'id',
      index: ['title', 'text'],
      store: ['text', 'data']
    },
    tokenize: 'full'
  }
): Document<GenericSearchData> => {
  const index = new Document<GenericSearchData>(options)

  mog('CreateIndexOptions', { indexData, initList, options })

  if (indexData && Object.keys(indexData).length > 0) {
    // When using a prebuilt index read from disk present in the indexData parameter
    mog('Using Prebuilt Index!', {})
    Object.entries(indexData).forEach(([key, data]) => {
      const parsedData = JSON.parse((data as string) ?? '') ?? null
      index.import(key, parsedData)
    })
  } else {
    initList.forEach((block) => {
      block.blockId = createIndexCompositeKey(block.id, block.blockId ?? block.id)

      mog('Block', block)

      index.add({ ...block, tag: [block.id] })
    })
  }
  return index
}

export const exportAsync = (index) => {
  const idxResult = {}
  return new Promise<any>((resolve, reject) => {
    try {
      return index.export(async (key, data) => {
        try {
          idxResult[key] = data
          if (key === 'store') {
            // Hacky Fix: store is the last key that is exported so we resolve when store finishes exporting
            resolve(idxResult)
          }
        } catch (err) {
          reject(err)
        }
      })
    } catch (err) {
      reject(err)
    }
  })
}

export const exportIndex = async (indexEntries) => {
  const result = diskIndex

  for (const [idxName, idxVal] of indexEntries) {
    result[idxName] = await exportAsync(idxVal)
  }
  return result
}
