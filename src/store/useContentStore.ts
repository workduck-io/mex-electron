import { TodoType } from '@editor/Components/Todo/types'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import { NodeContent, NodeMetadata } from '../types/data'
import { NodeEditorContent } from '../types/Types'

export interface Contents {
  // Mapped with nodeid
  [key: string]: NodeContent
}

interface ContentStoreState {
  contents: Contents
  saved: boolean
  setSaved: (saved: boolean) => void
  removeContent: (nodeid: string) => void
  getContent: (nodeid: string) => NodeContent
  setContent: (nodeid: string, content: NodeEditorContent, metadata?: NodeMetadata) => void
  // Nodeid mapped metadata
  getAllMetadata: () => Record<string, NodeMetadata>
  getMetadata: (nodeid: string) => NodeMetadata
  setMetadata: (nodeid: string, metadata: NodeMetadata) => void
  initContents: (contents: Contents) => void
}

export const useContentStore = create<ContentStoreState>(
  devtools((set, get) => ({
    contents: {},
    saved: false,
    setSaved: (saved) => set(() => ({ saved })),
    setContent: (nodeid, content, metadata) => {
      // mog('SetContent', { nodeid, content, metadata })
      const oldContent = get().contents
      // console.log('OldContent is here:', { oldContent: oldContent[nodeid] })

      const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
      if (oldContent?.[nodeid]) delete oldContent?.[nodeid]
      const nmetadata = { ...oldMetadata, ...metadata }

      set({
        contents: { ...oldContent, [nodeid]: { type: 'editor', content, metadata: nmetadata } }
      })
    },
    getAllMetadata: () => {
      const contents = get().contents
      const metadata = {}
      Object.keys(contents).forEach((key) => {
        if (contents[key].metadata) {
          metadata[key] = contents[key].metadata
        }
      })
      return metadata
    },
    getMetadata: (nodeid) => {
      const contents = get().contents
      return contents[nodeid] && contents[nodeid].metadata ? contents[nodeid].metadata : {}
    },
    setMetadata: (nodeid: string, metadata: NodeMetadata) => {
      const oldContent = get().contents
      const oldMetadata = oldContent[nodeid] && oldContent[nodeid].metadata ? oldContent[nodeid].metadata : undefined
      const content = oldContent[nodeid] && oldContent[nodeid].content ? oldContent[nodeid].content : undefined
      delete oldContent[nodeid]
      const nmetadata = { ...oldMetadata, ...metadata }
      // console.log({ oldMetadata, nmetadata, metadata })
      set({
        contents: { ...oldContent, [nodeid]: { type: 'editor', content, metadata: nmetadata } }
      })
    },
    getContent: (nodeid) => {
      return get().contents[nodeid]
    },
    removeContent: (nodeid) => {
      const oldContent = get().contents
      delete oldContent[nodeid]
    },
    initContents: (contents) => {
      set({
        contents
      })
    }
  }))
)
