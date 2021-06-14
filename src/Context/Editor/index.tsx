import React, { createContext, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { EditorContextType, EditorStateProps } from '../../Types/EditorContext';
import TreeNode from '../../Types/tree';
import { getContent, getInitialEditorState } from './helpers';

export const editorContext = createContext<EditorContextType>({
  state: getInitialEditorState(),
  loadNode: () => {},
});

function useProvideEditorContext(): EditorContextType {
  const [editorState, setEditorState] = useState<EditorStateProps>(
    getInitialEditorState()
  );
  const history = useHistory();

  const loadEditorNode = (node: TreeNode) => {
    // console.log('loading Node', { node });
    setEditorState({
      ...editorState,
      node,
      content: getContent(node.id),
    });
    history.push('/editor');
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

export {
  ProvideEditorContext,
  useEditorContext,
  getContent,
  getInitialEditorState,
};
