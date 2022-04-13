import { Document } from '@workduck-io/flexsearch'

import { FileData } from './data'

export interface GenericSearchData {
  id: string
  blockId?: string
  title?: string
  text: string
  data?: any
  tag?: string[]
}

export interface SearchIndex {
  node: Document<GenericSearchData> | null
  snippet: Document<GenericSearchData> | null
  archive: Document<GenericSearchData> | null
  template: Document<GenericSearchData> | null
}

export interface GenericSearchResult {
  id: string
  blockId?: string
  title?: string
  text?: string
  data?: any
  matchField?: string[]
  tag?: string[]
}

export type idxKey = keyof SearchIndex

export interface SearchWorker {
  init: (fileData: FileData, indexData: Record<idxKey, any>) => void
  addDoc: (key: idxKey, nodeId: string, contents: any[], title: string, tags?: Array<string>) => void
  updateDoc: (key: idxKey, nodeId: string, contents: any[], title: string, tags?: Array<string>) => void
  removeDoc: (key: idxKey, id: string) => void
  searchIndex: (key: idxKey | idxKey[], query: string, tags: Array<string>) => GenericSearchResult[]
  searchIndexByNodeId: (key: idxKey | idxKey[], nodeId: string, query: string) => GenericSearchResult[]
  dumpIndexDisk: (location: string) => Promise<void>
  searchIndexWithRanking: (key: idxKey | idxKey[], query: string, tags?: Array<string>) => GenericSearchResult[]
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
