import { Document } from 'flexsearch'

import { FileData } from './data'

export interface GenericSearchData {
  id: string
  blockId?: string
  title?: string
  text: string
  tag?: string[]
}

export interface SearchIndex {
  node: Document<GenericSearchData> | null
  snippet: Document<GenericSearchData> | null
  archive: Document<GenericSearchData> | null
}

export interface GenericSearchResult {
  id: string
  blockId?: string
  title?: string
  text?: string
  matchField?: string[]
  tag?: string[]
}

export type idxKey = keyof SearchIndex

export interface SearchWorker {
  init: (fileData: FileData, indexData: Record<idxKey, any>) => void
  addDoc: (key: idxKey, nodeId: string, contents: any[], title: string) => void
  updateDoc: (key: idxKey, nodeId: string, contents: any[], title: string) => void
  removeDoc: (key: idxKey, id: string) => void
  searchIndex: (key: idxKey | idxKey[], query: string) => GenericSearchResult[]
  searchIndexByNodeId: (key: idxKey | idxKey[], nodeId: string, query: string) => GenericSearchResult[]
  dumpIndexDisk: (location: string) => Promise<void>
}

export interface KanbanCard {
  id: string
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

export interface KanbanBoard {
  columns: KanbanColumn[]
}
