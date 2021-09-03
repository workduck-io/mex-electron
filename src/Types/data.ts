import { Snippet } from '../Editor/Store/SnippetStore'
import { SyncBlockData } from '../Editor/Components/SyncBlock'
import { ComboText, LinkCache, NodeEditorContent } from '../Editor/Store/Types'

export interface NodeContent {
  type: string
  content: NodeEditorContent
}

export interface FileData {
  ilinks: ComboText[]
  tags: ComboText[]
  contents: {
    [key: string]: NodeContent
  }
  linkCache: LinkCache
  syncBlocks: SyncBlockData[]
  userSettings: {
    theme: string
  }
  snippets: Snippet[]
}
