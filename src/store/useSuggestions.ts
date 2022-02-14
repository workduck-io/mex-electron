import { FlexSearchResult } from './useSearchStore'
import create from 'zustand'
import { AnyObject, TNode } from '@udecode/plate'

type SuggestionStoreType = {
  suggestions: FlexSearchResult[]
  setSuggestions: (suggestions: FlexSearchResult[]) => void
  query?: TNode<AnyObject>[]
  setQuery?: (query: TNode<AnyObject>[]) => void
}

const useSuggestionStore = create<SuggestionStoreType>((set) => ({
  suggestions: [],
  setSuggestions: (suggestions: FlexSearchResult[]) => set({ suggestions })
}))

export default useSuggestionStore
