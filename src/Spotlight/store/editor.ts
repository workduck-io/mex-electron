import { NodeEditorContent } from '../../Editor/Store/Types'
import create from 'zustand'

export type SelectionType = { text: string; metadata: string } | undefined

export type SpotlightEditorStoreType = {
  nodeId: string
  setNodeId: (nodeId: string) => void
  isPreview: boolean
  setIsPreview?: (val: boolean) => void
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  isSelection: boolean
  setIsSelection: (isSelection: boolean) => void
}

export const useSpotlightEditorStore = create<SpotlightEditorStoreType>((set, get) => ({
  nodeId: '',
  isPreview: false,
  setIsPreview: (val) => set({ isPreview: val }),
  isSelection: false,
  nodeContent: undefined,
  setNodeContent: (content) => set(() => ({ nodeContent: content })),
  setNodeId: (id) => set(() => ({ nodeId: id })),
  setIsSelection: (isSelection) => set({ isSelection })
}))
