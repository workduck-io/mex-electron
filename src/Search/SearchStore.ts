import create from 'zustand'
import { NodeSearchData, SearchResult } from '../Types/data'
import { createLunrIndex } from './localSearch'
import lunr from 'lunr-mutable-indexes'

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
    const docs = get().docs
    docs.set(nodeUID, { title: title, text: newDoc.text })
    console.log('Docs Updated: ', docs)
  },
  searchIndex: (query: string) => {
    const docs = get().docs
    const results = get().index.search(query)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.values<any>(results).forEach((result) => {
      const temp = docs.get(result.ref)
      result.text = temp.text
      result.title = temp.title
    })
    return results
  },
  fetchIndexJSON: () => {
    return get().index.toJSON()
  }
}))

export default useSearchStore
