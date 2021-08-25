import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createDeserializeHTMLPlugin,
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
  PlatePlugin,
  SPEditor,
} from '@udecode/plate'

import { createILinkPlugin } from '../Components/ilink/createILinkPlugin'
import { createSyncBlockPlugin } from '../Components/SyncBlock/createSyncBlockPlugin'
import { createTagPlugin } from '../Components/tag/createTagPlugin'
// import { TagCombobox } from '../Components/tag/components/TagCombobox';
// import { createTagPlugin } from '../Components/tag/createTagPlugin';
import { createBlurSelectionPlugin } from './blurSelection'
import {
  optionsAutoformat,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSelectOnBackspacePlugin,
  optionsSoftBreakPlugin,
} from './pluginOptions'

interface PluginConfigs {
  combobox: {
    onChange: OnChange<SPEditor>
    onKeyDown: KeyboardHandler
  }
}

/**
 * Plugin generator
 * @param config Configurations for the plugins, event handlers etc.
 * @returns Array of PlatePlugin
 */
const generatePlugins = (config: PluginConfigs) => {
  const Plugins: PlatePlugin[] = [
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

    // Custom Plugins
    createBlurSelectionPlugin() as PlatePlugin<SPEditor>,

    // Comboboxes
    createTagPlugin(), // Tags
    createILinkPlugin(), // Internal Links ILinks
    {
      onChange: config.combobox.onChange,
      onKeyDown: config.combobox.onKeyDown,
    },

    // Sync Blocks
    createSyncBlockPlugin(),

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),
  ]

  Plugins.push(createDeserializeHTMLPlugin({ plugins: Plugins }))

  return Plugins
}

export default generatePlugins
