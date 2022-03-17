import { expose } from 'threads/worker'

import { FileData } from './../../types/data'
import { createSearchIndex } from '../../utils/search/flexsearch'
import { diskIndex } from '../../data/search'
import { mog } from '../../utils/lib/helper'
import { SearchWorker, idxKey, GenericSearchData, GenericSearchResult, SearchIndex } from '../../types/search'

let globalSearchIndex: SearchIndex = null

const searchWorker: SearchWorker = {
  init: (fileData: FileData) => {
    globalSearchIndex = createSearchIndex(fileData, diskIndex)
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

  searchIndex: (key: idxKey | idxKey[], query: string) => {
    try {
      let response: any[] = []
      if (typeof key === 'string') {
        response = globalSearchIndex[key].search(query)
      } else {
        key.forEach((k) => (response = [...response, globalSearchIndex[k].search(query)]))
      }

      const results = new Array<any>()
      response.forEach((entry) => {
        const matchField = entry.field
        entry.result.forEach((i) => {
          mog('ResultEntry', { i })
          results.push({ id: i, matchField })
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
  }
}

expose(searchWorker as any)
