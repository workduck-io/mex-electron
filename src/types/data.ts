import { Service, SyncBlockData, SyncBlockTemplate, SyncStoreIntents } from '../editor/Components/SyncBlock'
import { Snippet } from '../store/useSnippetStore'
import { ILink, LinkCache, NodeEditorContent, Tag, TagsCache } from '../types/Types'

export interface NodeMetadata {
  createdBy?: string
  createdAt?: number
  lastEditedBy?: string
  updatedAt?: number
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

export interface FileData {
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
}

export interface NodeSearchData {
  nodeUID: string
  title?: string
  text: string
}
