import { NodeProperties } from './../../Editor/Store/EditorStore'
import { NodeEditorContent } from '../../Editor/Store/Types'
import create from 'zustand'

export type SelectionType = { text: string; metadata: string } | undefined

export type SpotlightEditorStoreType = {
  node: NodeProperties
  setNode: (node: NodeProperties) => void
  isPreview: boolean
  setIsPreview?: (val: boolean) => void
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  isSelection: boolean
  setIsSelection: (isSelection: boolean) => void
}

export const useSpotlightEditorStore = create<SpotlightEditorStoreType>((set, get) => ({
  node: undefined,
  isPreview: false,
  setIsPreview: (val) => set({ isPreview: val }),
  isSelection: false,
  nodeContent: undefined,
  setNodeContent: (content) => set(() => ({ nodeContent: content })),
  setNode: (node) => set(() => ({ node })),
  setIsSelection: (isSelection) => set({ isSelection })
}))
