import linkIcon from '@iconify-icons/ri/link';
import more2Fill from '@iconify-icons/ri/more-2-fill';
import saveLine from '@iconify-icons/ri/save-line';
import shareLine from '@iconify-icons/ri/share-line';
import {
  createPlateOptions,
  ELEMENT_MEDIA_EMBED,
  Plate,
  useStoreEditorValue,
} from '@udecode/plate';
import React, { useEffect, useState } from 'react';
import ReactTooltip from 'react-tooltip';
import IconButton from '../Styled/Buttons';
import { InfoTools, NodeInfo, NoteTitle, StyledEditor } from '../Styled/Editor';
import { ComboboxKey } from './Components/combobox/useComboboxStore';
import components from './Components/components';
import { ILinkComboboxItem } from './Components/ilink/components/ILinkComboboxItem';
import { ELEMENT_ILINK } from './Components/ilink/defaults';
import {
  ComboElementProps,
  MultiComboboxContainer,
} from './Components/multi-combobox/multiComboboxContainer';
import useMultiComboboxOnChange from './Components/multi-combobox/useMultiComboboxChange';
import useMultiComboboxOnKeyDown from './Components/multi-combobox/useMultiComboboxOnKeyDown';
import { SlashComboboxItem } from './Components/SlashCommands/SlashComboboxItem';
import { TagComboboxItem } from './Components/tag/components/TagComboboxItem';
import { ELEMENT_TAG } from './Components/tag/defaults';
import { deserialize, serialize } from './Plugins/md-serialize';
import generatePlugins from './Plugins/plugins';
import useDataStore from './Store/DataStore';
import { useEditorStore } from './Store/EditorStore';

const options = createPlateOptions();

const Editor = () => {
  const mdContent = useEditorStore((state) => state.content);
  const nodeId = useEditorStore((state) => state.node.id);
  const title = useEditorStore((state) => state.node.title);

  const tags = useDataStore((state) => state.tags);
  const ilinks = useDataStore((state) => state.ilinks);
  const slash_commands = useDataStore((state) => state.slash_commands);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [content, setContent] = useState<any[] | undefined>(undefined);

  const useEditorState = useStoreEditorValue();
  const [id, setId] = useState('__null__');
  const editableProps = {
    placeholder: 'Murmuring the mex hype...',
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

  // const onChange = (value: any) => {
  //   console.log('Hello we be saving', JSON.stringify(value, null, 2));
  // };

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

        slash_command: {
          cbKey: ComboboxKey.SLASH_COMMAND,
          trigger: '/',
          data: slash_commands,
        },
      }),

      onKeyDown: useMultiComboboxOnKeyDown(
        {
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
          // Slash command configs

          slash_command: {
            slateElementType: ELEMENT_MEDIA_EMBED,
            // Support for creating slash commands by user can be added here
            newItemHandler: () => {},
          },
        },
        {
          webem: {
            slateElementType: ELEMENT_MEDIA_EMBED,
            command: 'webem',
            options: {
              url: 'http://example.com/',
            },
          },
        }
      ),
    },
  };

  const comboboxRenderConfig: ComboElementProps = {
    keys: {
      ilink: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_ILINK,
          newItemHandler: (newItem) => {
            addILink(newItem);
          },
        },
        renderElement: ILinkComboboxItem,
      },
      tag: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_TAG,
          newItemHandler: (newItem) => {
            addTag(newItem);
          },
        },
        renderElement: TagComboboxItem,
      },
      slash_command: {
        comboTypeHandlers: {
          slateElementType: ELEMENT_MEDIA_EMBED,
          newItemHandler: () => {},
        },
        renderElement: SlashComboboxItem,
      },
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
          {/* <BallonToolbarMarks /> */}
          <Plate
            // onChange={onChange}
            id={id}
            editableProps={editableProps}
            initialValue={content}
            plugins={plugins}
            components={components}
            options={options}
          >
            <MultiComboboxContainer keys={comboboxRenderConfig.keys} />
          </Plate>
        </>
      )}
    </StyledEditor>
  );
};

export default Editor;
