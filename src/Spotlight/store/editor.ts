import { NodeEditorContent } from '../../Editor/Store/Types'
import create from 'zustand'

export type SelectionType = { text: string; metadata: string } | undefined

export type SpotlightEditorStoreType = {
  nodeId: string
  setNodeId: (nodeId: string) => void
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  selection: SelectionType
  setSelection: (selection: SelectionType) => void
}

export const useSpotlightEditorStore = create<SpotlightEditorStoreType>((set, get) => ({
  nodeId: '',
  selection: undefined,
  nodeContent: undefined,
  setNodeContent: (content) => set(() => ({ nodeContent: content })),
  setNodeId: (id) => set(() => ({ nodeId: id })),
  setSelection: (selectedContent) => set(() => ({ selection: selectedContent }))
}))
