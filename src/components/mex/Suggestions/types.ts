import { GenericSearchResult } from '../../../types/search'
import { NodeEditorContent } from '../../../types/types'

export type SuggestionContent = {
  title: string
  content: NodeEditorContent
  template?: boolean
}

export type SuggestionExtras = {
  pinned: boolean
  type: SuggestionElementType
}

export type SuggestionElementType = 'node' | 'snippet' | 'template'

export type SuggestionType = GenericSearchResult & SuggestionExtras
