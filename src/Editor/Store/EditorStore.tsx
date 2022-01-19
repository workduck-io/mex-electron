import React from 'react'
import create from 'zustand'
import { getContent, getInitialNode } from './helpers'
import { NodeEditorContent } from './Types'
import { defaultContent } from '../../Defaults/baseData'
import { Contents } from './ContentStore'
import { NodeContent } from '../../Types/data'

export interface NodeProperties {
  title: string
  id: string
  uid: string
  key: string
}

export type EditorContextType = {
  // State

  // Data of the current node
  node: NodeProperties
  // Contents of the current node
  // These are loaded internally from ID
  content: NodeContent
  readOnly: boolean

  setUid: (uid: string) => void

  fetchingContent: boolean

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

  setUid: (uid) => {
    const node = get().node
    node.uid = uid
    set({ node })
  },

  setFetchingContent: (value) =>
    set({
      fetchingContent: value
    }),

  loadNode: (node: NodeProperties) => {
    const content = getContent(node.uid)
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
