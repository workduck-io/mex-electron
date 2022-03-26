import React from 'react'
import create from 'zustand'
import { defaultContent } from '../data/Defaults/baseData'
import { NodeContent } from '../types/data'
import { getContent, getInitialNode } from '../utils/helpers'

export interface NodeProperties {
  title: string
  id: string
  nodeid: string
  path: string
}

export type EditorContextType = {
  // State

  // Data of the current node
  node: NodeProperties
  // Contents of the current node
  // These are loaded internally from ID
  content: NodeContent
  readOnly: boolean

  setUid: (nodeid: string) => void
  setNode: (node: NodeProperties) => void

  fetchingContent: boolean

  loadingNodeid: string | null
  setLoadingNodeid: (nodeid: string) => void
  clearLoadingNodeid: () => void

  // State transformations

  // Load a node and its contents in the editor
  loadNode: (node: NodeProperties) => void

  setFetchingContent: (value: boolean) => void

  loadNodeAndReplaceContent: (node: NodeProperties, content: NodeContent) => void

  setReadOnly: (isReadOnly: boolean) => void
}

export const useEditorStore = create<EditorContextType>((set, get) => ({
  node: getInitialNode(),
  content: defaultContent,
  readOnly: false,
  fetchingContent: false,

  setReadOnly: (isReadOnly: boolean) => {
    set({ readOnly: isReadOnly })
  },

  setUid: (nodeid) => {
    const node = get().node
    node.nodeid = nodeid
    set({ node })
  },

  setNode: (node: NodeProperties) => set({ node }),

  setFetchingContent: (value) =>
    set({
      fetchingContent: value
    }),

  loadingNodeid: null,
  setLoadingNodeid: (nodeid) =>
    set({
      loadingNodeid: nodeid
    }),
  clearLoadingNodeid: () =>
    set({
      loadingNodeid: null
    }),

  loadNode: (node: NodeProperties) => {
    const content = getContent(node.nodeid)
    set({
      node,
      content
    })
  },

  loadNodeAndReplaceContent: (node, content) => {
    set({ node, content })
  }
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withNodeOps = (Component: any) => {
  return function C2(props: any) {
    const loadNode = useEditorStore((state) => state.loadNode)
    const currentNode = useEditorStore((state) => state.node)

    return <Component loadNode={loadNode} currentNode={currentNode} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
