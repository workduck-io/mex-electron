import { Document } from 'flexsearch'

import { GenericSearchResult, SearchIndex } from '../../store/useSearchStore'
import { GenericSearchData, NodeSearchData } from '../../types/data'
import { indexNames } from '../../data/search'

export interface CreateSearchIndexData {
  node: GenericSearchData[] | null
  snippet: GenericSearchData[] | null
  archive: GenericSearchData[] | null
}

export const createSearchIndex = (data: CreateSearchIndexData, indexData: Record<indexNames, any>): SearchIndex => {
  // Pass options corrwectly depending on what fields are indexed ([title, text] for now)
  return {
    node: createGenricSearchIndex(data.node, indexData.node),
    snippet: createGenricSearchIndex(data.snippet, indexData.snippet),
    archive: createGenricSearchIndex(data.archive, indexData.archive)
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

  if (indexData) {
    // When using a prebuilt index read from disk present in the indexData parameter
    // console.log('Using Prebuilt Index!')
    Object.entries(indexData).forEach(([key, data]) => {
      // console.log('Key is: ', key)
      index.import(key, data ?? null)
    })
  } else {
    initList.forEach((i) => index.add(i))
  }
  return index
}
