import * as React from 'react';
import { setNodes } from '@udecode/plate-common';
import { TElement, useEditorRef } from '@udecode/plate-core';
import { MediaEmbedNodeData } from '@udecode/plate-media-embed';
import { ReactEditor } from 'slate-react';
import { IFrame, IFrameWrapper, RootElement } from './MediaEmbedElement.styles';
import { MediaEmbedElementProps } from './MediaEmbedElement.types';
import { MediaEmbedUrlInput } from './MediaEmbedUrlInput';

export const MediaEmbedElement = (props: MediaEmbedElementProps) => {
  const { attributes, children, element, nodeProps } = props;
  const [expand, setExpand] = React.useState(false);

  const editor = useEditorRef();
  const { url } = element;

  // console.log('styles', JSON.stringify({ styles }, null, 2));

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        <IFrameWrapper expand={expand}>
          <IFrame
            title="embed"
            src={`${url}?title=0&byline=0&portrait=0`}
            frameBorder="0"
            {...nodeProps}
          />
        </IFrameWrapper>

        <MediaEmbedUrlInput
          url={url}
          setExpand={setExpand}
          onChange={(val: string) => {
            const path = ReactEditor.findPath(editor, element);
            setNodes<TElement<MediaEmbedNodeData>>(
              editor,
              { url: val },
              { at: path }
            );
          }}
        />
      </div>
      {children}
    </RootElement>
  );
};
