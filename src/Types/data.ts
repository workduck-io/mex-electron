import { Snippet } from '../Editor/Store/SnippetStore'
import { SyncBlockData } from '../Editor/Components/SyncBlock'
import { ComboText, LinkCache, NodeEditorContent, ILink } from '../Editor/Store/Types'

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
  syncBlocks: SyncBlockData[]
  userSettings: {
    theme: string
    spotlight: { [key: string]: any }
  }
  snippets: Snippet[]
}
