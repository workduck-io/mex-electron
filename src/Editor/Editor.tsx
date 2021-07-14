import linkIcon from '@iconify-icons/ri/link';
import more2Fill from '@iconify-icons/ri/more-2-fill';
import saveLine from '@iconify-icons/ri/save-line';
import shareLine from '@iconify-icons/ri/share-line';
import {
  createSlatePluginsOptions,
  OnChange,
  SlatePlugins,
  useStoreEditorRef,
  useStoreEditorValue,
} from '@udecode/slate-plugins';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { MENTIONABLES } from '../Conf/mentions';
import { useEditorContext } from '../Context/Editor';
import IconButton from '../Styled/Buttons';
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor';
import BallonToolbarMarks from './Components/BaloonToolbar';
import { useComboboxOnKeyDown } from './Components/combobox/hooks/useComboboxOnKeyDown';
import { useComboboxIsOpen } from './Components/combobox/selectors/useComboboxIsOpen';
import { useComboboxStore } from './Components/combobox/useComboboxStore';
import components from './Components/components';
import { useTagOnChange } from './Components/tag/hooks/useTagOnChange';
import { useTagOnSelectItem } from './Components/tag/hooks/useTagOnSelectItem';
import { deserialize, serialize } from './Plugins/md-serialize';
import generatePlugins, { ComboboxContainer } from './Plugins/plugins';

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
        .catch((e) => console.error(e)); // eslint-disable-line no-console
    }
  }, [edCtx]);

  const onSave = () => {
    // On save the editor should serialize the state to markdown plaintext
    console.log(serialize(useEditorState));
  };

  // Combobox

  // Handle multiple combobox
  const useComboboxOnChange = (): OnChange => {
    const editor = useStoreEditorRef(id)!;

    const tagOnChange = useTagOnChange(editor, MENTIONABLES);
    const isOpen = useComboboxIsOpen();
    const closeMenu = useComboboxStore((state) => state.closeMenu);

    return useCallback(
      () => () => {
        let changed: boolean | undefined = false;
        changed = tagOnChange();
        if (changed) return;

        if (!changed && isOpen) closeMenu();
      },
      [closeMenu, isOpen, tagOnChange]
    );
  };

  const pluginConfigs = {
    combobox: {
      onChange: useComboboxOnChange(),
      onKeyDown: useComboboxOnKeyDown({
        // Handle multiple combobox
        onSelectItem: useTagOnSelectItem(),
        onNewItem: (editor, setName) => {
          console.log('We gotta create a new item here fellas', { editor });
          setName('Hello');
        },
      }),
    },
  };

  // We get memoized plugins
  const plugins = useMemo(() => generatePlugins(pluginConfigs), [
    pluginConfigs,
  ]);

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
