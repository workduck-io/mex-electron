// import { NodeSearchResult } from './useSearchStore'
import { TNode } from '@udecode/plate'
import { mog } from '@utils/lib/mog'
import create from 'zustand'

import { SuggestionType } from '../components/mex/Suggestions/types'

type SuggestionStoreType = {
  suggestions: SuggestionType[]
  setSuggestions: (suggestions: SuggestionType[]) => void

  pinnedSuggestions: SuggestionType[]
  pinSuggestion: (pinnedSuggestions: SuggestionType) => void

  actionVisible: boolean
  toggleActionInSuggestion: () => void

  headingQASearch?: boolean
  setHeadingQASearch: (headingQASearch: boolean) => void

  query?: TNode[]
  setQuery?: (query: TNode[]) => void
}

const useSuggestionStore = create<SuggestionStoreType>((set, get) => ({
  suggestions: [],
  setSuggestions: (suggestions: SuggestionType[]) => {
    const pinnedSuggestions = get().pinnedSuggestions
    mog('Suggesigons', { suggestions, pinnedSuggestions })

    set({ suggestions: suggestions.filter((s) => pinnedSuggestions.filter((p) => p.id === s.id).length === 0) })
  },

  actionVisible: true,
  toggleActionInSuggestion: () => set({ actionVisible: !get().actionVisible }),

  pinnedSuggestions: [],
  pinSuggestion: (suggestionToPin: SuggestionType) => {
    const suggestions = get().suggestions.filter((suggestion) => suggestion.id !== suggestionToPin.id)

    const pinnedSuggestions = get().pinnedSuggestions
    const isAlreadyPinned = pinnedSuggestions.find((suggestion) => suggestion.id === suggestionToPin.id)

    const suggestionPinned = { ...suggestionToPin, pinned: !suggestionToPin.pinned }

    if (isAlreadyPinned) {
      set({
        pinnedSuggestions: pinnedSuggestions.filter((s) => s.id !== suggestionToPin.id),
        suggestions: [suggestionPinned, ...suggestions]
      })

      return
    }

    set({
      pinnedSuggestions: [...pinnedSuggestions, suggestionPinned],
      suggestions
    })
  },

  setHeadingQASearch: (headingQASearch: boolean) => set({ headingQASearch })
}))

export default useSuggestionStore
