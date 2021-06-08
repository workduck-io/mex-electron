import React, { useContext, createContext, useState } from 'react';
import TreeNode from '../Types/tree';

interface EditorStateProps {
  node: TreeNode;
  // Is the editor in focus
}

export type EditorContextType = {
  // State variables
  state: EditorStateProps | null;
  // State transformations
  loadNode: (node: TreeNode) => void;
};

export const editorContext = createContext<EditorContextType | null>(null);

const getInitialEditorState = (): EditorStateProps | null => {
  return {
    node: {
      title: '@',
      id: '@',
      key: '@',
      path: '@',
      mex_icon: undefined,
      children: [],
    },
  };
};

function useProvideEditorContext(): EditorContextType {
  const [editorState, setEditorState] = useState<EditorStateProps | null>(
    getInitialEditorState()
  );

  const loadEditorNode = (node: TreeNode) => {
    setEditorState({
      ...editorState,
      node,
    });
  };
  return { state: editorState, loadNode: loadEditorNode };
}

function ProvideEditorContext(props: { children: React.ReactNode }) {
  const value = useProvideEditorContext();
  const { children } = props;
  return (
    <editorContext.Provider value={value}>{children}</editorContext.Provider>
  );
}

function useEditorContext() {
  return useContext(editorContext);
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export const withEditorCtx = (Component: any) => {
  return function C2(props: any) {
    const edCtx = useEditorContext();

    return <Component edCtx={edCtx} {...props} />; // eslint-disable-line react/jsx-props-no-spreading
  };
};

export { ProvideEditorContext, useEditorContext };
