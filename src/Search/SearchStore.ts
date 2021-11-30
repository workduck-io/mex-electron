import create from 'zustand'
import { NodeSearchData, SearchResult } from '../Types/data'
import { createLunrIndex } from './localSearch'
import lunr from 'lunr-mutable-indexes'
import { Document } from 'flexsearch'
import { createFlexsearchIndex } from './flexsearch'

interface NodeTitleText {
  title: string
  text: string
}
interface SearchStoreState {
  docs: Map<string, NodeTitleText>
  index: lunr.Index | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => lunr.Index
  addDoc: (doc: NodeSearchData) => void
  addMultipleDocs: (docs: NodeSearchData[]) => void
  removeDoc: (nodeUID: string) => void
  updateDoc: (nodeUID: string, newDoc: NodeSearchData, title: string) => void
  searchIndex: (query: string) => SearchResult[]
  fetchIndexJSON: () => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const useSearchStore = create<SearchStoreState>((set, get) => ({
  docs: new Map<string, NodeTitleText>(),
  index: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => {
    const index = createLunrIndex(initList, indexData)
    set({ index })
    initList.forEach((doc) => {
      get().docs.set(doc.nodeUID, { title: doc.title, text: doc.text })
    })
    return index
  },
  addDoc: (doc: NodeSearchData) => {
    get().index.add(doc)
  },
  addMultipleDocs: (docs: NodeSearchData[]) => {
    const index = get().index
    docs.forEach((doc) => index.add(doc))
  },
  removeDoc: (nodeUID: string) => {
    get().index.remove({
      nodeUID
    })
    get().docs.delete(nodeUID)
  },
  updateDoc: (nodeUID: string, newDoc: NodeSearchData, title: string) => {
    get().index.update({
      nodeUID,
      text: newDoc.text,
      title: title
    })
    get().docs.set(nodeUID, { title: title, text: newDoc.text })
    // console.log('Docs Updated: ', docs)
  },
  searchIndex: (query: string) => {
    const docs = get().docs
    const results = get().index.search(query)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values<any>(results).forEach((result) => {
      const temp = docs.get(result.ref)
      if (result.text) {
        result.text = temp.text
      }
      if (result.title) {
        result.title = temp.title
      }
    })
    return results
  },
  fetchIndexJSON: () => {
    return get().index.toJSON()
  }
}))

export interface FlexSearchResult {
  nodeUID: string
  title: string
  text: string
  matchField: string
}

interface NewSearchStoreState {
  docs: Map<string, NodeTitleText>
  index: Document | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[]) => Document
  addDoc: (doc: NodeSearchData) => void
  addMultipleDocs: (docs: NodeSearchData[]) => void
  removeDoc: (nodeUID: string) => void
  updateDoc: (nodeUID: string, newDoc: NodeSearchData, title: string) => void
  fetchDocByID: (id: string, matchField: string) => FlexSearchResult
  searchIndex: (query: string) => FlexSearchResult[]
}

export const useNewSearchStore = create<NewSearchStoreState>((set, get) => ({
  docs: new Map<string, NodeTitleText>(),
  index: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[]) => {
    const index = createFlexsearchIndex(initList)
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
    console.log('Updated Docs are: ')
    console.log(get().docs)
  },
  fetchDocByID: (id: string, matchField: string) => {
    const doc = get().docs.get(id)
    const result: FlexSearchResult = {
      ...doc,
      nodeUID: id,
      matchField
    }
    return result
  },
  searchIndex: (query: string) => {
    const response = get().index.search(query)
    const results = new Array<FlexSearchResult>()
    response.forEach((entry) => {
      const matchField = entry.field
      entry.result.forEach((i) => {
        const t = get().fetchDocByID(i, matchField)
        results.push(t)
      })
    })
    return results
  }
}))

export default useSearchStore
