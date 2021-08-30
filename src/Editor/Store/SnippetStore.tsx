import create from 'zustand'

// To be used later

interface Snippet {
  id: string
  content: any[]
}

interface SnippetStore {
  snippets: Snippet[]

  initSnippets: (snippets: Snippet[]) => void
  addSnippets: (snippets: Snippet) => void
  updateSnippet: (snippets: Snippet) => void
}

export const useSnippetStore = create<SnippetStore>((set) => ({
  snippets: [],
  initSnippets: (snippets: Snippet[]) =>
    set({
      snippets
    }),

  addSnippets: (snippet: Snippet) => set((state) => ({ snippets: [...state.snippets, snippet] })),

  updateSnippet: (snippet: Snippet) => set((state) => ({ snippets: state.snippets }))
}))
