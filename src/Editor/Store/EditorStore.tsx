import React from 'react';
import create from 'zustand';
import { getContent, getInitialNode, getNodeFromId } from './helpers';
import TreeNode from '../../Types/tree';

export type EditorContextType = {
  // State

  // Data of the current node
  node: TreeNode;
  // Contents of the current node
  // These are loaded internally from ID
  content: string;

  showGraph: boolean;

  // State transformations

  // Load a node and its contents in the editor
  loadNode: (node: TreeNode) => void;

  loadNodeFromId: (id: string) => void;

  toggleGraph: () => void;
};

export const useEditorStore = create<EditorContextType>((set, get) => ({
  node: getInitialNode(),
  content: getContent('@'),
  showGraph: false,
  loadNode: (node: TreeNode) => {
    set(() => ({
      node,
      content: getContent(node.id),
    }));
  },
  loadNodeFromId: (id: string) => {
    const node = getNodeFromId(id);
    set(() => ({
      node,
      content: getContent(node.id),
    }));
  },
  toggleGraph: () => {
    set(() => ({
      showGraph: !get().showGraph,
    }));
  },
}));

/* eslint-disable @typescript-eslint/no-explicit-any */

export const withLoadNode = (Component: any) => {
  return function C2(props: any) {
    const loadNode = useEditorStore(state => state.loadNode);

    return <Component loadNode={loadNode} {...props} />; // eslint-disable-line react/jsx-props-no-spreading
  };
};
