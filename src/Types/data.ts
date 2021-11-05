import { Service, SyncBlockData, SyncBlockTemplate, SyncStoreIntents } from '../Editor/Components/SyncBlock'
import { Snippet } from '../Editor/Store/SnippetStore'
import { ComboText, ILink, LinkCache, NodeEditorContent } from '../Editor/Store/Types'
import lunr from 'lunr-mutable-indexes'
export interface NodeContent {
  type: string
  content: NodeEditorContent
}

export interface FileData {
  // variable to detect whether the data in the file was updated via mex/spotlight or externally
  remoteUpdate: boolean
  ilinks: ILink[]
  tags: ComboText[]
  contents: {
    [key: string]: NodeContent
  }
  linkCache: LinkCache

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

export interface SearchResult extends lunr.Index.Result {
  ref: string
  nodeName: string
  title: string
  text: string
  matchData: any // eslint-disable-line @typescript-eslint/no-explicit-any
}
