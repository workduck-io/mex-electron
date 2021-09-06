import create from 'zustand'
import { NodeContent } from '../../Types/data'
import { NodeEditorContent } from './Types'

export interface Contents {
  [key: string]: NodeContent
}

interface ContentStoreState {
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (id: string) => void
  getContent: (id: string) => NodeContent
  setContent: (id: string, content: NodeEditorContent) => void
  initContents: (contents: Contents) => void
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  contents: {},
  saved: false,
  setSaved: (saved) => set(() => ({ saved })),
  setContent: (id, content) => {
    const oldContent = get().contents
    delete oldContent[id]
    set({
      contents: { [id]: { type: 'editor', content }, ...oldContent }
    })
  },
  getContent: (id) => {
    return get().contents[id]
  },
  removeContent: (id) => {
    const oldContent = get().contents
    delete oldContent[id]
  },
  initContents: (contents) => {
    set({
      contents
    })
  }
}))
