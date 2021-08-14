import { setNodes } from '@udecode/plate-common';
import { TElement, useEditorRef } from '@udecode/plate-core';
import { MediaEmbedNodeData } from '@udecode/plate-media-embed';
import * as React from 'react';
import { useEffect } from 'react';
import EmbedContainer from 'react-oembed-container';
import { ReactEditor } from 'slate-react';
import { getEmbedData } from './getEmbedUrl';
import { IFrame, IFrameWrapper, MediaHtml, RootElement } from './MediaEmbedElement.styles';
import { MediaEmbedElementProps } from './MediaEmbedElement.types';
import { MediaEmbedUrlInput } from './MediaEmbedUrlInput';

export const MediaEmbedElement = (props: MediaEmbedElementProps) => {
  const { attributes, children, element, nodeProps } = props;
  const [expand, setExpand] = React.useState(false);

  const editor = useEditorRef();
  const { url } = element;

  const [htmlData, setHtmlData] = React.useState<string | undefined>(undefined);
  // console.log('styles', JSON.stringify({ styles }, null, 2));

  useEffect(() => {
    const getData = async () => {
      const d = await getEmbedData(url);
      if (d) {
        setHtmlData(d);
      } else {
        setHtmlData('');
      }
    };

    getData();
  }, [url]);

  return (
    <RootElement {...attributes}>
      <div contentEditable={false}>
        {htmlData ? (
          <EmbedContainer markup={htmlData}>
            <MediaHtml>
              {/* eslint-disable-next-line react/no-danger */}
              <div dangerouslySetInnerHTML={{ __html: htmlData }} />
            </MediaHtml>
          </EmbedContainer>
        ) : (
          <IFrameWrapper expand={expand}>
            <IFrame title="embed" src={`${url}`} frameBorder="0" {...nodeProps} />
          </IFrameWrapper>
        )}

        <MediaEmbedUrlInput
          url={url}
          setExpand={setExpand}
          htmlData={htmlData}
          onChange={(val: string) => {
            const path = ReactEditor.findPath(editor, element);
            setNodes<TElement<MediaEmbedNodeData>>(editor, { url: val }, { at: path });
          }}
        />
      </div>
      {children}
    </RootElement>
  );
};
