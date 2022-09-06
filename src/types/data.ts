import {
  Service,
  SyncBlockData,
  SyncBlockTemplate,
  SyncStoreIntents
} from '../editor/Components/SyncBlock/SyncBlock.types'
import { TodosType } from '../editor/Components/Todo/types'
import { ILink, LinkCache, NodeEditorContent, SharedNode, Tag, TagsCache } from '../types/Types'
import { Reminder } from './reminders'

export interface Snippet {
  id: string
  title: string
  icon: string
  content: any[]
  template?: boolean
}

export type FilterKey = 'note' | 'tag' | 'date' | 'state' | 'has' | 'mention'
export interface View<Item> {
  title: string
  description?: string
  id: string
  filters: SearchFilter<Item>[]
}

export interface SearchFilter<Item> {
  key: FilterKey
  id: string
  label: string
  // Value to filter with
  value: string
  // filter: (item: Item) => boolean | number -> Replaced by FilterFunctions
  icon?: string
  // No. of items that match this filter
  count?: number
  // sort: 'asc' | 'desc'
}

export type Entity = Record<string, unknown>

export interface NodeMetadata {
  createdBy?: string
  createdAt?: number
  lastEditedBy?: string
  updatedAt?: number
  publicAccess?: boolean
  iconUrl?: string
  // The snippet ID with which all the children nodes should be populated
  templateID?: string
}

export interface NodeContent {
  /** Type of content */
  // Usually init when created
  // editor when it has been updated
  // TODO: Check where this is necessary and try to remove it
  type: string

  /** Version */
  content: NodeEditorContent

  /** Version */
  version?: number

  /** Node Metadata */
  metadata?: NodeMetadata
}

export interface FileSaveBuffer {
  views?: View<any>[]
}

export interface FileData {
  // Version. Should be same as Mex. Lower versions will be updated.
  version: string

  // variable to detect whether the data in the file was updated via mex/spotlight or externally
  remoteUpdate: boolean
  baseNodeId: string
  ilinks: ILink[]
  tags: Tag[]
  contents: {
    [key: string]: NodeContent
  }
  archive: ILink[]
  linkCache: LinkCache
  tagsCache: TagsCache
  bookmarks: string[]
  sharedNodes: SharedNode[]

  // Tasks
  todos: TodosType
  views: View<any>[]

  // Reminders
  reminders: Reminder[]

  // Sync
  syncBlocks: SyncBlockData[]
  templates: SyncBlockTemplate[]
  intents: SyncStoreIntents
  services: Service[]

  // Misc
  userSettings: {
    theme: string
    spotlight: { [key: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any
  }
  snippets: Snippet[]

  saveBuffer?: FileSaveBuffer
}

export interface NodeSearchData {
  nodeUID: string
  title?: string
  text: string
}
