import create from 'zustand'
import { NodeContent, NodeMetadata } from '../types/data'
import { NodeEditorContent } from '../types/Types'

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
  setContent: (uid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  setMetadata: (uid: string, metadata: NodeMetadata) => void
  initContents: (contents: Contents) => void
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  contents: {},
  showSyncBlocks: false,
  saved: false,
  setSaved: (saved) => set(() => ({ saved })),
  toggleSyncBlocks: () => set({ showSyncBlocks: !get().showSyncBlocks }),
  setContent: (uid, content, metadata) => {
    const oldContent = get().contents

    const oldMetadata = oldContent[uid] && oldContent[uid].metadata ? oldContent[uid].metadata : undefined
    delete oldContent[uid]
    const nmetadata = { ...oldMetadata, ...metadata }
    // console.log({ oldMetadata, nmetadata, metadata })
    set({
      contents: { [uid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
    })
  },
  setMetadata: (uid: string, metadata: NodeMetadata) => {
    const oldContent = get().contents
    const oldMetadata = oldContent[uid] && oldContent[uid].metadata ? oldContent[uid].metadata : undefined
    const content = oldContent[uid] && oldContent[uid].content ? oldContent[uid].content : undefined
    delete oldContent[uid]
    const nmetadata = { ...oldMetadata, ...metadata }
    // console.log({ oldMetadata, nmetadata, metadata })
    set({
      contents: { [uid]: { type: 'editor', content, metadata: nmetadata }, ...oldContent }
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
