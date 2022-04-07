import create from 'zustand'

export interface Snippet {
  id: string
  title: string
  icon: string
  content: any[]
  isTemplate?: boolean
}

interface SnippetEditorStore {
  snippet?: Snippet
}

interface SnippetStore {
  snippets: Snippet[]

  initSnippets: (snippets: Snippet[]) => void
  addSnippet: (snippets: Snippet) => void
  updateSnippet: (id: string, snippets: Snippet) => void
  updateSnippetContent: (id: string, content: any[]) => void
  deleteSnippet: (id: string) => void

  editor: SnippetEditorStore
  loadSnippet: (id: string) => void
}

export const useSnippetStore = create<SnippetStore>((set, get) => ({
  snippets: [],

  initSnippets: (snippets: Snippet[]) =>
    set({
      snippets
    }),

  addSnippet: (snippet: Snippet) => set((state) => ({ snippets: [...state.snippets, snippet] })),

  updateSnippet: (id: string, snippet: Snippet) =>
    // Updates the snippet at the ID with a new snippet,
    // replaces the entire value including ID
    set((state) => {
      const snippets = state.snippets.filter((s) => s.id !== id)
      return { snippets: [...snippets, snippet] }
    }),

  updateSnippetContent: (id: string, content: any[]) => {
    const snippets = get().snippets.map((s) => {
      if (s.id === id) {
        return { ...s, content }
      }
      return s
    })
    set({ snippets })
  },

  deleteSnippet: (id: string) =>
    // Updates the snippet at the ID with a new snippet,
    // replaces the entire value including ID
    set((state) => {
      const snippets = state.snippets.filter((s) => s.id !== id)
      return { snippets }
    }),

  editor: { snippet: undefined },

  loadSnippet: (id: string) =>
    set((state) => {
      const snippet = state.snippets.filter((s) => s.id === id)
      if (snippet.length > 0) {
        return { editor: { snippet: snippet[0] } }
      }
    })
}))
