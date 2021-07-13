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
  createParagraphPlugin,
  createReactPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTablePlugin,
  createUnderlinePlugin,
  KeyboardHandler,
  OnChange,
  SlatePlugin,
  SPEditor,
} from '@udecode/slate-plugins';
import React, { useMemo } from 'react';
import { useComboboxControls } from '../Components/combobox/hooks/useComboboxControls';
import { TagCombobox } from '../Components/tag/components/TagCombobox';
import { createTagPlugin } from '../Components/tag/createTagPlugin';
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

  return <TagCombobox />;
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

    // Custom Plugins
    createBlurSelectionPlugin() as SlatePlugin<SPEditor>,

    // Comboboxes
    // Tags
    createTagPlugin(),
    {
      onChange: config.combobox.onChange,
      onKeyDown: config.combobox.onKeyDown,
    },
  ];

  return Plugins;
};

export default generatePlugins;
