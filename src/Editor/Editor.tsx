import linkIcon from '@iconify-icons/ri/link';
import more2Fill from '@iconify-icons/ri/more-2-fill';
import shareLine from '@iconify-icons/ri/share-line';
import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import RichMarkdownEditor from 'rich-markdown-editor';
import { useEditorContext } from '../Context/Editor';
import IconButton from '../Styled/Buttons';
import {
  dark,
  InfoTools,
  NodeInfo,
  NoteTitle,
  StyledEditor,
} from '../Styled/Editor';

const Editor = () => {
  const noF = () => {};
  const edCtx = useEditorContext();
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);
  const content = edCtx.state?.content ?? 'Start Writing';
  const id = edCtx.state?.node.id || '@';

  // console.log('Editor here is updating', { content, id });

  const onClickLink = (href: string, event: unknown) => {
    console.log('Click', href, event); // eslint-disable-line no-console
    // currently opens link in the browser, check if
    window.open(href, '_blank');
    // require('shell').openExternal('http://www.google.com');
    // if (isInternalLink(href)) {
    //   history.push(href);
    // } else {
    //   window.location.href = href;
    // }
  };

  return (
    <StyledEditor className="mex_editor">
      <NodeInfo>
        <NoteTitle>{edCtx?.state?.node.title}</NoteTitle>
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

        // defaultValue={content}
        value={content}
        /** Default value is set for the first render
         * Value and default value change with editor context
         * Value is used to change editor content on node change in context
         */

        id={id}
        onBlur={noF}
        onCancel={noF}
        onClickHashtag={noF}
        onClickLink={onClickLink}
        onFocus={noF}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onHoverLink={(e: any) => {
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
