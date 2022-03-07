import create from 'zustand'
import { FileData, GenericSearchData, NodeSearchData } from '../types/data'
import { Document } from 'flexsearch'

import { createSearchIndex, exportAsync } from '../utils/search/flexsearch'
import { mog } from '../utils/lib/helper'
import { indexNames, diskIndex } from './../data/search'

interface NodeTitleText {
  title: string
  text: string
}

// interface NewSearchStoreState {
//   docs: Map<string, NodeTitleText>
//   index: Document<GenericSearchData> | null
//   indexDump: any
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => Document<GenericSearchData>
//   addDoc: (doc: NodeSearchData) => void
//   addMultipleDocs: (docs: NodeSearchData[]) => void
//   removeDoc: (nodeUID: string) => void
//   updateDoc: (nodeUID: string, newDoc: NodeSearchData, title: string) => void
//   // fetchDocByID: (id: string, matchField: string) => NodeSearchResult
//   // searchIndex: (query: string) => NodeSearchResult[]
//   fetchIndexLocalStorage: () => void
// }

// prettier-ignore
export interface GenericSearchResult {
    id:         string
    title?:     string
    text?:      string
    matchField?: string[]
  }

// prettier-ignore
export interface SearchIndex {
    node:    Document<GenericSearchData> | null
    snippet: Document<GenericSearchData> | null
    archive: Document<GenericSearchData> | null
  }

interface SearchStoreState {
  // docs: Map<string, NodeTitleText>
  index: SearchIndex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  indexDump: any
  initializeSearchIndex: (fileData: FileData, indexData: any) => SearchIndex
  addDoc: (index: keyof SearchIndex, doc: GenericSearchData) => void
  removeDoc: (index: keyof SearchIndex, id: string) => void
  updateDoc: (index: keyof SearchIndex, newDoc: GenericSearchData) => void
  // fetchDocByID: (index: keyof SearchIndex, id: string, matchField: string[]) => GenericSearchResult
  searchIndex: (index: keyof SearchIndex, query: string) => GenericSearchResult[]
  fetchIndexLocalStorage: () => any
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  // docs: new Map<string, NodeTitleText>(),
  index: diskIndex,
  indexDump: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (fileData, indexData: any) => {
    const index = createSearchIndex(fileData, indexData)
    set({ index })
    // initList.forEach((doc) => {
    //   get().docs.set(doc.nodeUID, { title: doc.title, text: doc.text })
    // })
    return index
  },

  addDoc: (key, doc: GenericSearchData) => {
    // get().docs.set(doc.nodeUID, { title: doc.title, text: doc.text })
    if (get().index[key]) {
      get().index[key].add(doc)
    }
  },

  removeDoc: (key, id: string) => {
    get().index[key].remove(id)
  },

  updateDoc: (key, newDoc) => {
    get().index[key].update(newDoc)
  },

  // fetchDocByID: (key, id: string, matchField: string[]) => {
  //   // const doc = get().docs.get(id)
  //   const result: GenericSearchResult = {
  //     // ...doc,
  //     id: id,
  //     matchField
  //   }
  //   return result
  // },

  searchIndex: (key, query: string) => {
    try {
      const response = get().index[key].search(query)
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
  },

  fetchIndexLocalStorage: async () => {
    const indexEntries = Object.entries(get().index)
    const result = diskIndex

    for (const [idxName, idxVal] of indexEntries) {
      result[idxName] = await exportAsync(idxVal)
    }
    return result
  }
}))
