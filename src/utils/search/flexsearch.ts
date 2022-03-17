import { Document } from 'flexsearch'

import { FileData, GenericSearchData } from '../../types/data'
import { diskIndex, indexNames } from '../../data/search'
import { convertDataToIndexable } from './localSearch'

import { SearchIndex } from '../../types/search'
export interface CreateSearchIndexData {
  node: GenericSearchData[] | null
  snippet: GenericSearchData[] | null
  archive: GenericSearchData[] | null
}

export const createSearchIndex = (fileData: FileData, data: CreateSearchIndexData): SearchIndex => {
  // TODO: Find a way to delay the conversion until needed i.e. if index is not present
  const initList: Record<indexNames, any> = convertDataToIndexable(fileData)
  // Pass options corrwectly depending on what fields are indexed ([title, text] for now)
  return {
    node: createGenricSearchIndex(initList.node, data.node),
    snippet: createGenricSearchIndex(initList.snippet, data.snippet),
    archive: createGenricSearchIndex(initList.archive, data.archive)
  }
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
      index: ['title', 'text']
    },
    tokenize: 'full'
  }
): Document<GenericSearchData> => {
  const index = new Document<GenericSearchData>(options)

  if (indexData && Object.keys(indexData).length > 0) {
    // When using a prebuilt index read from disk present in the indexData parameter
    // mog('Using Prebuilt Index!', {})
    Object.entries(indexData).forEach(([key, data]) => {
      const parsedData = JSON.parse((data as string) ?? '') ?? null
      index.import(key, parsedData)
    })
  } else {
    // mog('Adding from FileData', { initList })
    initList.forEach((i) => index.add(i))
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
