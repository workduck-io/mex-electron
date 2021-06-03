import linkIcon from '@iconify-icons/ri/link';
import more2Fill from '@iconify-icons/ri/more-2-fill';
import shareLine from '@iconify-icons/ri/share-line';
import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import RichMarkdownEditor from 'rich-markdown-editor';
import IconButton from '../Styled/Buttons';
import {
  dark,
  InfoTools,
  NodeInfo,
  NoteTitle,
  StyledEditor,
} from '../Styled/Editor';

export type EditorProps = { content: string };

const Editor: React.FC<EditorProps> = ({ content }: EditorProps) => {
  // console.log({ content });
  const noF = () => {};

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  return (
    <StyledEditor className="mex_editor">
      <NodeInfo>
        <NoteTitle>Button Component</NoteTitle>
        <InfoTools>
          <IconButton size={24} icon={shareLine} title="Share" />
          <IconButton size={24} icon={linkIcon} title="Copy Link" />
          <IconButton size={24} icon={more2Fill} title="Options" />
        </InfoTools>
      </NodeInfo>
      <RichMarkdownEditor
        theme={dark}
        // Dark theme for the editor

        autoFocus
        // When set true together with readOnly set to false, focus at the end of the document automatically.

        defaultValue={content}
        onBlur={noF}
        onCancel={noF}
        onClickHashtag={noF}
        onClickLink={noF}
        onFocus={noF}
        onHoverLink={(e) => {
          console.log(e); // eslint-disable-line no-console
          return false;
        }}
        onChange={noF}
        onSave={noF}
        onShowToast={noF}
      />
    </StyledEditor>
  );
};

export default Editor;
