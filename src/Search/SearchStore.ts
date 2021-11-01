import create from 'zustand'
import { NodeSearchData } from '../Types/data'
import { createLunrIndex } from './localSearch'
import lunr from 'lunr-mutable-indexes'

interface SearchStoreState {
  index: lunr.Index | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => lunr.Index
  addDoc: (doc: NodeSearchData) => void
  addMultipleDocs: (docs: NodeSearchData[]) => void
  removeDoc: (nodeUID: string) => void
  updateDoc: (nodeUID: string, newDoc: NodeSearchData) => void
  searchIndex: (query: string) => lunr.Index.Result[]
  fetchIndexJSON: () => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

const useSearchStore = create<SearchStoreState>((set, get) => ({
  index: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initializeSearchIndex: (initList: NodeSearchData[], indexData: any) => {
    const index = createLunrIndex(initList, indexData)
    set({ index })
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
    return get().index.search(query)
  },
  fetchIndexJSON: () => {
    return get().index.toJSON()
  }
}))

export default useSearchStore
