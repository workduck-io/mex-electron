import create from 'zustand'
import { GenericSearchData, NodeSearchData } from '../types/data'
import { Document } from 'flexsearch'

import { createSearchIndex, CreateSearchIndexData } from '../utils/search/flexsearch'
import { mog } from '../utils/lib/helper'
import { indexNames, diskIndex } from './../data/search'

interface NodeTitleText {
  title: string
  text: string
}

interface NewSearchStoreState {
  docs: Map<string, NodeTitleText>
  index: Document | null
  indexDump: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => Document
  addDoc: (doc: NodeSearchData) => void
  addMultipleDocs: (docs: NodeSearchData[]) => void
  removeDoc: (nodeUID: string) => void
  updateDoc: (nodeUID: string, newDoc: NodeSearchData, title: string) => void
  // fetchDocByID: (id: string, matchField: string) => NodeSearchResult
  // searchIndex: (query: string) => NodeSearchResult[]
  fetchIndexLocalStorage: () => void
}

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
  initializeSearchIndex: (initList: Record<indexNames, GenericSearchData[]>, indexData: any) => Document
  addDoc: (index: keyof SearchIndex, doc: NodeSearchData) => void
  removeDoc: (index: keyof SearchIndex, nodeUID: string) => void
  updateDoc: (index: keyof SearchIndex, newDoc: GenericSearchData) => void
  // fetchDocByID: (index: keyof SearchIndex, id: string, matchField: string[]) => GenericSearchResult
  searchIndex: (index: keyof SearchIndex, query: string) => GenericSearchResult[]
  fetchIndexLocalStorage: () => void
}

export const useSearchStore = create<SearchStoreState>((set, get) => ({
  // docs: new Map<string, NodeTitleText>(),
  index: diskIndex,
  indexDump: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (searchData, indexData: any) => {
    const index = createSearchIndex(searchData, indexData)
    set({ index })
    // initList.forEach((doc) => {
    //   get().docs.set(doc.nodeUID, { title: doc.title, text: doc.text })
    // })
    return index
  },

  addDoc: (key, doc: NodeSearchData) => {
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
    const response = get().index[key].search(query)
    const results = new Array<any>()
    response.forEach((entry) => {
      const matchField = entry.field
      entry.result.forEach((i) => {
        // mog('ResultEntry', i)
        // const t = get().fetchDocByID(i, matchField)
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
  },

  fetchIndexLocalStorage: () => {
    get().index['node'].export((key, data) => {
      mog('fetchIndexLocalStorage', { key, data })
      localStorage.setItem(key, data)
    })

    Object.entries(get().index).forEach(([idxName, idxValue]) => {
      idxValue.export((key, data) => {
        mog('fetchIndexLocalStorage', { key, data })
        localStorage.setItem(`${idxName}.${key}`, data)
      })
    })
  }
}))
