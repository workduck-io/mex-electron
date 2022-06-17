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
  shared: Document<GenericSearchData> | null
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

/** Search Replacements Extra
 * For blocks with types that match the keys, they are replaced with text given by the replacement value
 */
export interface SearchRepExtra {
  /** Type of the block
   And a key value pair of what to replace at that id
   */
  [type: string]: {
    /** The key of the block used to index replacements */
    keyToIndex: string
    /** replacements for the block text that is keyed by keyToIndex */
    replacements: Record<string, string>
  }
}

export type idxKey = keyof SearchIndex

export interface SearchWorker {
  init: (fileData: FileData, indexData: Record<idxKey, any>) => void
  addDoc: (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string,
    tags?: Array<string>,
    extra?: SearchRepExtra
  ) => void
  updateDoc: (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string,
    tags?: Array<string>,
    extra?: SearchRepExtra
  ) => void
  removeDoc: (key: idxKey, id: string) => void
  searchIndex: (key: idxKey | idxKey[], query: string, options?: SearchOptions) => GenericSearchResult[]
  searchIndexByNodeId: (key: idxKey | idxKey[], nodeId: string, query: string) => GenericSearchResult[]
  dumpIndexDisk: (location: string) => Promise<void>
  searchIndexWithRanking: (key: idxKey | idxKey[], query: string, options?: SearchOptions) => GenericSearchResult[]
}

export type SearchOptions = {
  tags?: Array<string>
  searchFields?: Record<idxKey, Array<string>>
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
