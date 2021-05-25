import React from 'react';
import RichMarkdownEditor from 'rich-markdown-editor';
import styled from 'styled-components';

const StyledDiv = styled('div')`
  /* width: 100%; */
  padding: ${({ theme }) => theme.spacing.medium};
  margin: ${({ theme }) => theme.spacing.medium};
`;

export type EditorProps = { content: string };

const Editor: React.FC<EditorProps> = ({ content }: EditorProps) => {
  console.log({ content });
  const noF = () => {};
  return (
    <StyledDiv>
      <RichMarkdownEditor
        dark
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
          console.log(e);
          return false;
        }}
        onChange={noF}
        onSave={noF}
        onShowToast={noF}
      />
    </StyledDiv>
  );
};

export default Editor;
