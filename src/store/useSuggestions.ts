// import { NodeSearchResult } from './useSearchStore'
import create from 'zustand'
import { AnyObject, TNode } from '@udecode/plate'
import { GenericSearchResult } from './useSearchStore'

type SuggestionStoreType = {
  suggestions: GenericSearchResult[]
  setSuggestions: (suggestions: GenericSearchResult[]) => void
  query?: TNode<AnyObject>[]
  setQuery?: (query: TNode<AnyObject>[]) => void
}

const useSuggestionStore = create<SuggestionStoreType>((set) => ({
  suggestions: [],
  setSuggestions: (suggestions: GenericSearchResult[]) => set({ suggestions })
}))

export default useSuggestionStore
