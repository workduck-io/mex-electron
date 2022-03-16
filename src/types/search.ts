import { Document } from 'flexsearch'

import { FileData } from './data'

export interface GenericSearchData {
  id: string
  title?: string
  text: string
}

export interface SearchIndex {
  node: Document<GenericSearchData> | null
  snippet: Document<GenericSearchData> | null
  archive: Document<GenericSearchData> | null
}

export interface GenericSearchResult {
  id: string
  title?: string
  text?: string
  matchField?: string[]
}

export type idxKey = keyof SearchIndex

export interface SearchWorker {
  init: (fileData: FileData) => void
  addDoc: (key: idxKey, doc: GenericSearchData) => void
  updateDoc: (key: idxKey, doc: GenericSearchData) => void
  removeDoc: (key: idxKey, id: string) => void
  searchIndex: (key: idxKey | idxKey[], query: string) => GenericSearchResult[]
}
