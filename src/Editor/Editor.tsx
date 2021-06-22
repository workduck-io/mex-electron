import linkIcon from '@iconify-icons/ri/link';
import more2Fill from '@iconify-icons/ri/more-2-fill';
import shareLine from '@iconify-icons/ri/share-line';
import saveLine from '@iconify-icons/ri/save-line';

import {
  createSlatePluginsComponents,
  createSlatePluginsOptions,
  SlatePlugins,
  useStoreEditorValue,
} from '@udecode/slate-plugins';
import React, { useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import { useEditorContext } from '../Context/Editor';
import IconButton from '../Styled/Buttons';
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor';

import { initialValueBasicElements } from './defaultValue';
import Plugins from './plugins';

const components = createSlatePluginsComponents();
const options = createSlatePluginsOptions();

const Editor = () => {
  const edCtx = useEditorContext();
  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);
  const content = edCtx.state?.content ?? 'Start Writing';
  const useEditorState = useStoreEditorValue();
  // const id = edCtx.state?.node.id || '@';
  const editableProps = {
    placeholder: 'Type…',
    style: {
      padding: '15px',
    },
  };

  const onSave = () => {
    console.log(useEditorState);
    // On save the editor should serialize the state to markdown plaintext
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

      <SlatePlugins
        id="1"
        editableProps={editableProps}
        initialValue={initialValueBasicElements}
        plugins={Plugins}
        components={components}
        options={options}
      />

      <hr />
      <div>{content}</div>
    </StyledEditor>
  );
};

export default Editor;
