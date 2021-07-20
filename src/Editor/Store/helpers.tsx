import devNotes from '../../Conf/sampleDocs/sampleDev';
import PDR from '../../Conf/sampleDocs/samplePDR';
import rishankNotes from '../../Conf/sampleDocs/sampleRishank';
import twitterNotes from '../../Conf/sampleDocs/sampleTwitter';
import SampleMarkdown from '../../Conf/sampleMarkdown';
import meetingNotes from '../../Conf/sampleMeeting';
import { EditorStateProps } from '../../Types/EditorContext';
import TreeNode from '../../Types/tree';

/** Get the contents of the node with id */
export function getContent(id: string): string {
  // console.log('Loading ID', id);
  // create a hashmap with id vs content
  // load the content from hashmap

  if (id === '@') {
    return 'This is temporary markdown for @';
  }

  if (id === 'lib') {
    return SampleMarkdown;
  }

  if (id.includes('meet')) {
    return meetingNotes;
  }

  if (id.includes('doc')) {
    return PDR;
  }

  if (id.includes('dev')) {
    return devNotes;
  }

  if (id.includes('twitter')) {
    return twitterNotes;
  }

  if (id.includes('rishank')) {
    return rishankNotes;
  }

  return 'This is default content';
}

export const getInitialEditorState = (): EditorStateProps => {
  return {
    node: {
      title: '@',
      id: '@',
      key: '@',
      mex_icon: undefined,
      children: [],
    },
    content: getContent('@'),
  };
};

export const getInitialNode = (): TreeNode => ({
  title: '@',
  id: '@',
  key: '@',
  mex_icon: undefined,
  children: [],
});

export const getNodeFromId = (id: string): TreeNode => {
  // search for ID and load it's node
  return {
    title: id,
    id,
    key: id,
    mex_icon: undefined,
    children: [],
  };
};
