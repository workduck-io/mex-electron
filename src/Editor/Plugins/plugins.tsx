import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  // createDeserializeMDPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHistoryPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTablePlugin,
  createUnderlinePlugin,
  ELEMENT_MEDIA_EMBED,
  KeyboardHandler,
  OnChange,
  SlatePlugin,
  SPEditor,
} from '@udecode/slate-plugins';

import React from 'react';
import { useComboboxControls } from '../Components/combobox/hooks/useComboboxControls';
import { ILinkCombobox } from '../Components/ilink/components/ILinkCombobox';
import { createILinkPlugin } from '../Components/ilink/createILinkPlugin';
// import { TagCombobox } from '../Components/tag/components/TagCombobox';
// import { createTagPlugin } from '../Components/tag/createTagPlugin';
import { createBlurSelectionPlugin } from './blurSelection';
import {
  optionsAutoformat,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSelectOnBackspacePlugin,
  optionsSoftBreakPlugin,
} from './pluginOptions';

// Handle multiple combobox
export const ComboboxContainer = () => {
  useComboboxControls();

  // return <TagCombobox />;
  return <ILinkCombobox />;
};

interface PluginConfigs {
  combobox: {
    onChange: OnChange<SPEditor>;
    onKeyDown: KeyboardHandler;
  };
}

/**
 * Plugin generator
 * @param config Configurations for the plugins, event handlers etc.
 * @returns Array of SlatePlugin
 */
const generatePlugins = (config: PluginConfigs) => {
  const Plugins: SlatePlugin[] = [
    // editor
    createReactPlugin(), // withReact
    createHistoryPlugin(), // withHistory

    // elements
    createParagraphPlugin(), // paragraph element
    createBlockquotePlugin(), // blockquote element
    createCodeBlockPlugin(), // code block element
    createHeadingPlugin(), // heading elements

    // Marks
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(), // underline mark
    createStrikethroughPlugin(), // strikethrough mark
    createCodePlugin(), // code mark

    // Special Elements
    createImagePlugin(), // Image
    createLinkPlugin(), // Link
    createListPlugin(), // List
    createTablePlugin(), // Table

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),

    // Editing Plugins
    createSoftBreakPlugin(optionsSoftBreakPlugin),
    createExitBreakPlugin(optionsExitBreakPlugin),
    createResetNodePlugin(optionsResetBlockTypePlugin),

    // Autoformat markdown syntax to elements (**, #(n))
    createAutoformatPlugin(optionsAutoformat),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin(),
    createSelectOnBackspacePlugin({ allow: [ELEMENT_MEDIA_EMBED] }),
    // Custom Plugins
    createBlurSelectionPlugin() as SlatePlugin<SPEditor>,

    // Comboboxes
    // createTagPlugin(), // Tags
    createILinkPlugin(), // Internal Links ILinks
    {
      onChange: config.combobox.onChange,
      onKeyDown: config.combobox.onKeyDown,
    },
  ];

  return Plugins;
};

export default generatePlugins;
