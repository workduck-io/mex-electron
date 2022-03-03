import { Document } from 'flexsearch'
import { GenericSearchResult, SearchIndex } from '../../store/useSearchStore'
import { GenericSearchData, NodeSearchData } from '../../types/data'

export interface CreateSearchIndexData {
  node: GenericSearchData[] | null
  snippet: GenericSearchData[] | null
  archive: GenericSearchData[] | null
}

export const createSearchIndex = (data: CreateSearchIndexData, indexData: any): SearchIndex => {
  return {
    node: data.node ? createGenricSearchIndex(data.node, indexData) : null,
    snippet: data.snippet ? createGenricSearchIndex(data.snippet, indexData) : null,
    archive: data.archive ? createGenricSearchIndex(data.snippet, indexData) : null
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
    // console.log('Using Prebuilt Index!')
    Object.entries(indexData).forEach(([key, data]) => {
      // console.log('Key is: ', key)
      index.import(key, data ?? null)
    })
  } else {
    // console.log('Fresh building Index')
    initList.forEach((i) => index.add(i))
  }
  return index
}
