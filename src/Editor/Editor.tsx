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
import IconButton from '../Styled/Buttons';
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor';
import BallonToolbarMarks from './Components/BaloonToolbar';
import { ComboboxKey } from './Components/combobox/useComboboxStore';
import components from './Components/components';
import { ELEMENT_ILINK } from './Components/ilink/defaults';
import useMultiComboboxOnChange from './Components/multi-combobox/useMultiComboboxChange';
import useMultiComboboxOnKeyDown from './Components/multi-combobox/useMultiComboboxOnKeyDown';
import { ELEMENT_TAG } from './Components/tag/defaults';
import { deserialize, serialize } from './Plugins/md-serialize';
import generatePlugins, { ComboboxContainer } from './Plugins/plugins';
import useDataStore from './Store/DataStore';
import { useEditorStore } from './Store/EditorStore';

const options = createSlatePluginsOptions();

const Editor = () => {
  const mdContent = useEditorStore((state) => state.content);
  const nodeId = useEditorStore((state) => state.node.id);
  const title = useEditorStore((state) => state.node.title);

  const tags = useDataStore((state) => state.tags);
  const ilinks = useDataStore((state) => state.ilinks);

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

  const addTag = useDataStore((state) => state.addTag);
  const addILink = useDataStore((state) => state.addILink);
  // console.log(initialValueBasicElements);

  useEffect(() => {
    if (mdContent && nodeId) {
      deserialize(mdContent)
        .then((sdoc) => {
          setContent(sdoc);
          setId(nodeId);
          return null;
        })
        .catch((e) => console.error(e)); // eslint-disable-line no-console
    }
  }, [mdContent, nodeId]);

  const onSave = () => {
    // On save the editor should serialize the state to markdown plaintext
    console.log(serialize(useEditorState)); // eslint-disable-line no-console
  };

  // Combobox

  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(id, {
        ilink: {
          cbKey: ComboboxKey.ILINK,
          trigger: '[[',
          data: ilinks,
        },
        tag: {
          cbKey: ComboboxKey.TAG,
          trigger: '#',
          data: tags,
        },
      }),
      onKeyDown: useMultiComboboxOnKeyDown({
        ilink: {
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (newItem) => {
            addILink(newItem);
          },
        },
        tag: {
          slateElementType: ELEMENT_TAG,
          newItemHandler: (newItem) => {
            addTag(newItem);
          },
        },
      }),
    },
  };

  // We get memoized plugins
  const plugins = generatePlugins(pluginConfigs);

  return (
    <StyledEditor className="mex_editor">
      <NodeInfo>
        <NoteTitle>{title}</NoteTitle>
        <InfoTools>
          <IconButton size={24} icon={saveLine} onClick={onSave} title="Save" />
          <IconButton size={24} icon={shareLine} title="Share" />
          <IconButton size={24} icon={linkIcon} title="Copy Link" />
          <IconButton size={24} icon={more2Fill} title="Options" />
        </InfoTools>
      </NodeInfo>

      {content && (
        <>
          <BallonToolbarMarks />
          <SlatePlugins
            id={id}
            editableProps={editableProps}
            initialValue={content}
            plugins={plugins}
            components={components}
            options={options}
          >
            <ComboboxContainer />
          </SlatePlugins>
        </>
      )}
    </StyledEditor>
  );
};

export default Editor;
