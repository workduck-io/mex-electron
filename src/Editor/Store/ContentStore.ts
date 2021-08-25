import create from 'zustand'
import { NodeContent } from '../../Types/data'
import { NodeEditorContent } from './Types'

export interface Contents {
  [key: string]: NodeContent
}

interface ContentStoreState {
  contents: Contents
  getContent: (id: string) => void
  setContent: (id: string, content: NodeEditorContent) => void
  initContents: (contents: Contents) => void
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  contents: {},
  setContent: (id, content) => {
    const oldContent = get().contents
    delete oldContent[id]
    set({
      contents: { [id]: { type: 'editor', content }, ...oldContent },
    })
  },
  getContent: (id) => {
    return get().contents[id]
  },
  initContents: (contents) => {
    set({
      contents,
    })
  },
}))
