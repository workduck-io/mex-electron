import { EditorStateProps } from '../../Types/EditorContext';

/** Get the contents of the node with id */
export function getContent(id: string): string {
  // console.log('Loading ID', id);
  // create a hashmap with id vs content
  // load the content from hashmap

  if (id === '@') {
    return 'This is temporary markdown for @';
  }
  if (id === 'lib') {
    return 'This is This is Library';
  }

  return 'This is default content';
}

export const getInitialEditorState = (): EditorStateProps => {
  return {
    node: {
      title: '@',
      id: '@',
      key: '@',
      path: '@',
      mex_icon: undefined,
      children: [],
    },
    content: getContent('@'),
  };
};
