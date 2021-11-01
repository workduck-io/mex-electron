import create from 'zustand'
import { NodeSearchData, SearchResult } from '../Types/data'
import { createLunrIndex } from './localSearch'
import lunr from 'lunr-mutable-indexes'

interface SearchStoreState {
  docs: Map<string, string>
  index: lunr.Index | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => lunr.Index
  addDoc: (doc: NodeSearchData) => void
  addMultipleDocs: (docs: NodeSearchData[]) => void
  removeDoc: (nodeUID: string) => void
  updateDoc: (nodeUID: string, newDoc: NodeSearchData) => void
  searchIndex: (query: string) => SearchResult[]
  fetchIndexJSON: () => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const useSearchStore = create<SearchStoreState>((set, get) => ({
  docs: new Map<string, string>(),
  index: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => {
    const index = createLunrIndex(initList, indexData)
    set({ index })
    initList.forEach((doc) => {
      get().docs.set(doc.nodeUID, doc.text)
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
  },
  updateDoc: (nodeUID: string, newDoc: NodeSearchData) => {
    get().index.update({
      nodeUID,
      text: newDoc.text
    })
  },
  searchIndex: (query: string) => {
    const docs = get().docs
    const results = get().index.search(query)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values<any>(results).forEach((result) => {
      result.text = docs.get(result.ref)
    })
    return results
  },
  fetchIndexJSON: () => {
    return get().index.toJSON()
  }
}))

export default useSearchStore
