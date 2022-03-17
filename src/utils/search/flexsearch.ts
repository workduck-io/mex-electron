import { Document } from 'flexsearch'

import { FileData, GenericSearchData } from '../../types/data'
import { diskIndex, indexNames } from '../../data/search'
import { convertDataToIndexable } from './parseData'
import { SearchIndex } from '../../types/search'
import { mog } from '../lib/helper'
export interface CreateSearchIndexData {
  node: GenericSearchData[] | null
  snippet: GenericSearchData[] | null
  archive: GenericSearchData[] | null
}

export const createSearchIndex = (fileData: FileData, data: CreateSearchIndexData) => {
  // TODO: Find a way to delay the conversion until needed i.e. if index is not present
  const { result: initList, blockNodeMap: bnMap } = convertDataToIndexable(fileData)

  const idx = Object.entries(indexNames).reduce((p, c) => {
    const idxName = c[0]
    let options: any

    switch (idxName) {
      case indexNames.node:
      case indexNames.archive: {
        options = {
          document: {
            id: 'blockId',
            index: ['title', 'text']
          },
          tokenize: 'full'
        }
        break
      }
      case indexNames.snippet: {
        options = {
          document: {
            id: 'id',
            index: ['title', 'text']
          },
          tokenize: 'full'
        }
      }
    }

    return { ...p, [idxName]: createGenricSearchIndex(initList[idxName], data[idxName], options) }
  }, diskIndex)

  return { idx, bnMap }
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
    mog('Using Prebuilt Index!', {})
    Object.entries(indexData).forEach(([key, data]) => {
      const parsedData = JSON.parse((data as string) ?? '') ?? null
      index.import(key, parsedData)
    })
  } else {
    const initListLen = initList.length
    mog('AddingFromFileData', { initListLen })
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
