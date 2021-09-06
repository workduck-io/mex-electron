import React from 'react'
import create from 'zustand'
import { getContent, getInitialNode, getNodeFromId } from './helpers'
import TreeNode from '../../Types/tree'
import { NodeEditorContent } from './Types'

export type EditorContextType = {
  // State

  // Data of the current node
  node: TreeNode
  // Contents of the current node
  // These are loaded internally from ID
  content: NodeEditorContent
  readOnly: boolean

  setReadOnly: (isReadOnly: boolean) => void

  // State transformations

  // Load a node and its contents in the editor
  loadNode: (node: TreeNode) => void

  loadNodeFromId: (id: string) => void
}

export const useEditorStore = create<EditorContextType>((set, get) => ({
  node: getInitialNode(),
  content: getContent('@'),
  readOnly: false,

  setReadOnly: (isReadOnly: boolean) => {
    set(() => ({ readOnly: isReadOnly }))
  },

  loadNode: (node: TreeNode) => {
    set(() => ({
      node,
      content: getContent(node.id)
    }))
  },

  loadNodeFromId: (id: string) => {
    const node = getNodeFromId(id)
    set(() => ({
      node,
      content: getContent(id)
    }))
  }
}))

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withNodeOps = (Component: any) => {
  return function C2 (props: any) {
    const loadNode = useEditorStore((state) => state.loadNode)
    const currentNode = useEditorStore((state) => state.node)

    return <Component loadNode={loadNode} currentNode={currentNode} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
