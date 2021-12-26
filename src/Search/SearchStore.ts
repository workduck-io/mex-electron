import create from 'zustand'
import { NodeSearchData } from '../Types/data'
import { Document } from 'flexsearch'
import { createFlexsearchIndex } from './flexsearch'

interface NodeTitleText {
  title: string
  text: string
}
export interface FlexSearchResult {
  nodeUID: string
  title: string
  text: string
  matchField: string[]
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
  fetchDocByID: (id: string, matchField: string) => FlexSearchResult
  searchIndex: (query: string) => FlexSearchResult[]
  fetchIndexLocalStorage: () => void
}

export const useNewSearchStore = create<NewSearchStoreState>((set, get) => ({
  docs: new Map<string, NodeTitleText>(),
  index: null,
  indexDump: {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => {
    const index = createFlexsearchIndex(initList, indexData)
    set({ index })
    initList.forEach((doc) => {
      get().docs.set(doc.nodeUID, { title: doc.title, text: doc.text })
    })
    return index
  },
  addDoc: (doc: NodeSearchData) => {
    get().docs.set(doc.nodeUID, { title: doc.title, text: doc.text })
    get().index.add(doc)
  },
  addMultipleDocs: (docs: NodeSearchData[]) => {
    docs.forEach((doc) => get().addDoc(doc))
  },
  removeDoc: (nodeUID: string) => {
    get().index.remove(nodeUID)
  },
  updateDoc: (nodeUID: string, newDoc: NodeSearchData, title: string) => {
    get().docs.set(nodeUID, { title: title, text: newDoc.text })
    get().index.update({
      nodeUID: nodeUID,
      title: title,
      text: newDoc.text
    })
  },
  fetchDocByID: (id: string, matchField: string) => {
    const doc = get().docs.get(id)
    const result: any = {
      ...doc,
      nodeUID: id,
      matchField
    }
    return result
  },
  searchIndex: (query: string) => {
    const response = get().index.search(query)
    const results = new Array<any>()
    response.forEach((entry) => {
      const matchField = entry.field
      entry.result.forEach((i) => {
        const t = get().fetchDocByID(i, matchField)
        results.push(t)
      })
    })

    const combinedResults = new Array<FlexSearchResult>()
    results.forEach(function (item) {
      const existing = combinedResults.filter(function (v, i) {
        return v.nodeUID == item.nodeUID
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
    get().index.export((key, data) => {
      localStorage.setItem(key, data)
    })
  }
}))
