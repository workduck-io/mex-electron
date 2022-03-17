import { diskIndex } from './../../data/search'
import { expose } from 'threads/worker'

import { FileData } from './../../types/data'
import { createSearchIndex, exportIndex } from '../../utils/search/flexsearch'
import { mog } from '../../utils/lib/helper'
import { SearchWorker, idxKey, GenericSearchData, GenericSearchResult, SearchIndex } from '../../types/search'
import { setSearchIndexData } from './../utils/indexData'

let globalSearchIndex: SearchIndex = null
let blockNodeMapping: Record<idxKey, Record<string, string>> = diskIndex

const searchWorker: SearchWorker = {
  init: (fileData: FileData, indexData: Record<idxKey, any>) => {
    const { idx, bnMap } = createSearchIndex(fileData, indexData)

    globalSearchIndex = idx
    blockNodeMapping = bnMap
  },

  addDoc: (key: idxKey, doc: GenericSearchData) => {
    if (globalSearchIndex[key]) globalSearchIndex[key].add(doc)
  },

  updateDoc: (key: idxKey, doc: GenericSearchData) => {
    if (globalSearchIndex[key]) globalSearchIndex[key].update(doc)
  },

  removeDoc: (key: idxKey, id: string) => {
    if (globalSearchIndex[key]) globalSearchIndex[key].remove(id)
  },

  searchIndex: (key: idxKey, query: string) => {
    try {
      let response: any[] = []
      response = globalSearchIndex[key].search(query)

      const results = new Array<any>()
      response.forEach((entry) => {
        const matchField = entry.field
        entry.result.forEach((i) => {
          mog('ResultEntry', { i })
          results.push({ id: blockNodeMapping[key][i], blockId: i, matchField })
        })
      })

      const combinedResults = new Array<GenericSearchResult>()
      results.forEach(function (item) {
        const existing = combinedResults.filter(function (v, i) {
          return v.id == item.id
        })
        if (existing.length) {
          const existingIndex = combinedResults.indexOf(existing[0])
          combinedResults[existingIndex].matchField = combinedResults[existingIndex].matchField.concat(item.matchField)
        } else {
          if (typeof item.matchField == 'string') item.matchField = [item.matchField]
          combinedResults.push(item)
        }
      })

      return combinedResults
    } catch (e) {
      mog('Searching Broke:', { e })
      return []
    }
  },

  dumpIndexDisk: async (location: string) => {
    const indexEntries = Object.entries(globalSearchIndex)
    const indexDump = await exportIndex(indexEntries)

    setSearchIndexData(indexDump, location)
  }
}

expose(searchWorker as any)