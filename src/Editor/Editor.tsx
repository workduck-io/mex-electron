import linkIcon from '@iconify-icons/ri/link';
import more2Fill from '@iconify-icons/ri/more-2-fill';
import saveLine from '@iconify-icons/ri/save-line';
import shareLine from '@iconify-icons/ri/share-line';
import {
  createSlatePluginsOptions,
  SlatePlugins,
  useStoreEditorValue,
} from '@udecode/slate-plugins';
import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { useEditorContext } from '../Context/Editor';
import IconButton from '../Styled/Buttons';
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor';
import components from './Components/components';
import { serialize, deserialize } from './md-serialize';
import Plugins from './plugins';

const options = createSlatePluginsOptions();

const Editor = () => {
  const edCtx = useEditorContext();
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined);

  const useEditorState = useStoreEditorValue();
  const [id, setId] = useState('__null__');
  const editableProps = {
    placeholder: 'Type…',
    style: {
      padding: '15px',
    },
  };

  // console.log(initialValueBasicElements);

  useEffect(() => {
    const markdownContent = edCtx.state?.content;
    const nodeId = edCtx.state?.node.id;
    if (markdownContent && nodeId) {
      deserialize(markdownContent)
        .then((sdoc) => {
          setContent(sdoc);
          setId(nodeId);
          return null;
        })
        .catch((e) => console.error(e));
    }
  }, [edCtx]);

  const onSave = () => {
    // On save the editor should serialize the state to markdown plaintext
    console.log(serialize(useEditorState));
  };

  return (
    <StyledEditor className="mex_editor">
      <NodeInfo>
        <NoteTitle>{edCtx?.state?.node.title}</NoteTitle>
        <InfoTools>
          <IconButton size={24} icon={saveLine} onClick={onSave} title="Save" />
          <IconButton size={24} icon={shareLine} title="Share" />
          <IconButton size={24} icon={linkIcon} title="Copy Link" />
          <IconButton size={24} icon={more2Fill} title="Options" />
        </InfoTools>
      </NodeInfo>

      {content && (
        <SlatePlugins
          id={id}
          editableProps={editableProps}
          initialValue={content}
          plugins={Plugins}
          components={components}
          options={options}
        />
      )}
    </StyledEditor>
  );
};

export default Editor;
