// import { NodeSearchResult } from './useSearchStore'
import create from 'zustand'
import { AnyObject, TNode } from '@udecode/plate'
import { GenericSearchResult } from '../types/search'

type SuggestionType = GenericSearchResult & { pinned: boolean }

type SuggestionStoreType = {
  suggestions: SuggestionType[]
  setSuggestions: (suggestions: SuggestionType[]) => void
  pinnedSuggestions: SuggestionType[]
  pinSuggestion: (pinnedSuggestions: SuggestionType) => void
  query?: TNode<AnyObject>[]
  setQuery?: (query: TNode<AnyObject>[]) => void
}

const useSuggestionStore = create<SuggestionStoreType>((set, get) => ({
  suggestions: [],
  setSuggestions: (suggestions: SuggestionType[]) => set({ suggestions }),
  pinnedSuggestions: [],
  pinSuggestion: (suggestionToPin: SuggestionType) => {
    const suggestions = get().suggestions.filter((suggestion) => suggestion.id !== suggestionToPin.id)

    const pinnedSuggestions = get().pinnedSuggestions
    const isAlreadyPinned = pinnedSuggestions.find((suggestion) => suggestion.id === suggestionToPin.id)

    if (isAlreadyPinned) {
      set({
        pinnedSuggestions: pinnedSuggestions.filter((s) => s.id !== suggestionToPin.id),
        suggestions
      })

      return
    }

    set({
      pinnedSuggestions: [...pinnedSuggestions, { ...suggestionToPin, pinned: !suggestionToPin.pinned }],
      suggestions
    })
  }
}))

export default useSuggestionStore
