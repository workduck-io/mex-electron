import { Document } from 'flexsearch'

import { GenericSearchResult, SearchIndex } from '../../store/useSearchStore'
import { FileData, GenericSearchData, NodeSearchData } from '../../types/data'
import { indexNames } from '../../data/search'
import { mog } from '../lib/helper'
import { convertDataToIndexable } from './localSearch'

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
  const index = Document(options)

  if (indexData && Object.keys(indexData).length > 0) {
    // When using a prebuilt index read from disk present in the indexData parameter
    mog('Using Prebuilt Index!', {})
    Object.entries(indexData).forEach(([key, data]) => {
      const parsedData = JSON.parse((data as string) ?? '') ?? null
      mog('We have data is: ', { key, parsedData, data })
      index.import(key, parsedData)
    })
  } else {
    mog('Adding from FileData', { initList })
    initList.forEach((i) => index.add(i))
  }
  return index
}
