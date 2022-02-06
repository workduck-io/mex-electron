import { NodeProperties } from '../store/useEditorStore'
import { NodeEditorContent } from '../types/Types'
import create from 'zustand'
import { getNewDraftKey } from '../editor/Components/SyncBlock/getNewBlockData'
import { createNodeWithUid } from '../utils/lib/helper'
import { ListItemType } from '../components/spotlight/SearchResults/types'

export type SelectionType = { text: string; metadata: string } | undefined

export type SpotlightEditorStoreType = {
  node: NodeProperties
  setNode: (node: NodeProperties) => void
  isPreview: boolean
  setIsPreview?: (val: boolean) => void
  loadNode: (node: NodeProperties, content: NodeEditorContent) => void
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  currentListItem: ListItemType
  setCurrentListItem: (item: ListItemType) => void
  isSelection: boolean
  setIsSelection: (isSelection: boolean) => void
}

export const useSpotlightEditorStore = create<SpotlightEditorStoreType>((set, get) => ({
  node: createNodeWithUid(getNewDraftKey()),
  isPreview: false,
  setIsPreview: (val) => set({ isPreview: val }),
  isSelection: false,
  nodeContent: undefined,
  currentListItem: undefined,
  setCurrentListItem: (item) => set({ currentListItem: item }),
  setNodeContent: (content) => set(() => ({ nodeContent: content })),
  setNode: (node) => set(() => ({ node })),
  loadNode: (node: NodeProperties, content: NodeEditorContent) => set({ node, nodeContent: content }),
  setIsSelection: (isSelection) => set({ isSelection })
}))
