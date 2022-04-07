// import { NodeSearchResult } from './useSearchStore'
import create from 'zustand'
import { AnyObject, TNode } from '@udecode/plate'
import { SuggestionType } from '../components/mex/Suggestions/types'

type SuggestionStoreType = {
  suggestions: SuggestionType[]
  setSuggestions: (suggestions: SuggestionType[]) => void

  pinnedSuggestions: SuggestionType[]
  pinSuggestion: (pinnedSuggestions: SuggestionType) => void

  headingQASearch?: boolean
  setHeadingQASearch: (headingQASearch: boolean) => void

  query?: TNode<AnyObject>[]
  setQuery?: (query: TNode<AnyObject>[]) => void
}

const useSuggestionStore = create<SuggestionStoreType>((set, get) => ({
  suggestions: [],
  setSuggestions: (suggestions: SuggestionType[]) => {
    const pinnedSuggestions = get().pinnedSuggestions

    set({ suggestions: suggestions.filter((s) => pinnedSuggestions.filter((p) => p.id === s.id).length === 0) })
  },

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
  },

  setHeadingQASearch: (headingQASearch: boolean) => set({ headingQASearch })
}))

export default useSuggestionStore
