import create from 'zustand'
import { NodeContent } from '../../Types/data'
import { NodeEditorContent } from './Types'

export interface Contents {
  [key: string]: NodeContent
}

interface ContentStoreState {
  contents: Contents
  saved: boolean
  showSyncBlocks: boolean
  toggleSyncBlocks: () => void
  setSaved: (saved: boolean) => void
  removeContent: (uid: string) => void
  getContent: (uid: string) => NodeContent
  setContent: (uid: string, content: NodeEditorContent) => void
  initContents: (contents: Contents) => void
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  contents: {},
  showSyncBlocks: false,
  saved: false,
  setSaved: (saved) => set(() => ({ saved })),
  toggleSyncBlocks: () => set({ showSyncBlocks: !get().showSyncBlocks }),
  setContent: (uid, content) => {
    const oldContent = get().contents
    delete oldContent[uid]
    set({
      contents: { [uid]: { type: 'editor', content }, ...oldContent }
    })
  },
  getContent: (uid) => {
    return get().contents[uid]
  },
  removeContent: (uid) => {
    const oldContent = get().contents
    delete oldContent[uid]
  },
  initContents: (contents) => {
    set({
      contents
    })
  }
}))
