import { INIT_PREVIEW } from '../components/spotlight/Content'
import { ListItemType } from '../components/spotlight/SearchResults/types'
import { NodeEditorContent } from '../types/Types'
import { NodeProperties, useEditorStore } from '../store/useEditorStore'
import { PreviewType } from '../components/spotlight/Preview'
import create from 'zustand'
import { createNodeWithUid } from '../utils/lib/helper'
import { defaultContent } from '../data/Defaults/baseData'
import { getNewDraftKey } from '../editor/Components/SyncBlock/getNewBlockData'

export type SelectionType = { text: string; metadata: string } | undefined

export type SpotlightEditorStoreType = {
  node: NodeProperties
  setNode: (node: NodeProperties) => void
  preview: PreviewType
  setPreview?: (val: PreviewType) => void
  loadNode: (node: NodeProperties, content: NodeEditorContent) => void
  nodeContent: NodeEditorContent
  setNodeContent: (content: NodeEditorContent) => void
  currentListItem: ListItemType
  setCurrentListItem: (item: ListItemType) => void
  isSelection: boolean
  setIsSelection: (isSelection: boolean) => void
}

export const useSpotlightEditorStore = create<SpotlightEditorStoreType>((set, get) => ({
  node: createNodeWithUid(getNewDraftKey(), ''),
  preview: INIT_PREVIEW,
  setPreview: (val) => set({ preview: val }),
  isSelection: false,
  nodeContent: defaultContent.content,
  currentListItem: undefined,
  setCurrentListItem: (item) => set({ currentListItem: item }),
  setNodeContent: (content) => set(() => ({ nodeContent: content })),
  setNode: (node) => {
    useEditorStore.getState().setNode(node)
    set(() => ({ node }))
  },
  loadNode: (node: NodeProperties, content: NodeEditorContent) => set({ node, nodeContent: content }),
  setIsSelection: (isSelection) => set({ isSelection })
}))
