import { Service, SyncBlockData, SyncBlockTemplate, SyncStoreIntents } from '../Editor/Components/SyncBlock'
import { Snippet } from '../Editor/Store/SnippetStore'
import { ComboText, ILink, LinkCache, NodeEditorContent, TagsCache } from '../Editor/Store/Types'

export interface NodeMetadata {
  createdBy?: string
  createdAt?: number
  lastEditedBy?: string
  updatedAt?: number
}

export interface NodeContent {
  type: string
  content: NodeEditorContent
  // Node Metadata
  metadata?: NodeMetadata
}

export interface FileData {
  // variable to detect whether the data in the file was updated via mex/spotlight or externally
  remoteUpdate: boolean
  baseNodeId: string
  ilinks: ILink[]
  tags: ComboText[]
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
