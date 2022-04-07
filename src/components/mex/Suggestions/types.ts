import { GenericSearchResult } from '../../../types/search'
import { NodeEditorContent } from '../../../types/Types'

export type SuggestionContent = {
  title: string
  content: NodeEditorContent
  isTemplate?: boolean
}

export type SuggestionExtras = {
  pinned: boolean
  type: SuggestionElementType
}

export type SuggestionElementType = 'node' | 'snippet' | 'template'

export type SuggestionType = GenericSearchResult & SuggestionExtras
