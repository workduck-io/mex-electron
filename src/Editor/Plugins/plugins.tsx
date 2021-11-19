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
  createHighlightPlugin,
  createHistoryPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createReactPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTablePlugin,
  createUnderlinePlugin,
  PlateEditor,
  PlatePlugin
} from '@udecode/plate'
import { useMemo } from 'react'
import { createILinkPlugin } from '../Components/ilink/createILinkPlugin'
import { createInlineBlockPlugin } from '../Components/InlineBlock/createInlineBlockPlugin'
import { createSyncBlockPlugin } from '../Components/SyncBlock/createSyncBlockPlugin'
import { createTagPlugin } from '../Components/tag/createTagPlugin'
// import { TagCombobox } from '../Components/tag/components/TagCombobox';
// import { createTagPlugin } from '../Components/tag/createTagPlugin';
import { createBlurSelectionPlugin } from './blurSelection'
import {
  optionsAutoformat,
  optionsCreateNodeIdPlugin,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSelectOnBackspacePlugin,
  optionsSoftBreakPlugin
} from './pluginOptions'

/**
 * Plugin generator
 * @param config Configurations for the plugins, event handlers etc.
 * @returns Array of PlatePlugin
 */
const generatePlugins = () => {
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
    createHighlightPlugin(), // highlight mark

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

    createNodeIdPlugin(optionsCreateNodeIdPlugin),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin(),

    // Custom Plugins
    createBlurSelectionPlugin() as PlatePlugin<PlateEditor>,

    // Comboboxes
    createTagPlugin(), // Tags
    createILinkPlugin(), // Internal Links ILinks

    // Sync Blocks
    createSyncBlockPlugin(),

    // For Inline Blocks
    createInlineBlockPlugin(),

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin)
  ]

  Plugins.push(createDeserializeHTMLPlugin({ plugins: Plugins }))

  return Plugins
}

const useMemoizedPlugins = () => {
  return useMemo(() => generatePlugins(), [])
}

export default useMemoizedPlugins
