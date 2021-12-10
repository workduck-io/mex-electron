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
  createDndPlugin,
  createHighlightPlugin,
  createHistoryPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createTodoListPlugin,
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
  PEditor,
  PlatePlugin,
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatMath,
  autoformatPunctuation,
  autoformatSmartQuotes,
  ELEMENT_HR,
  createHorizontalRulePlugin,
  setNodes,
  ELEMENT_DEFAULT,
  insertNodes
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
    createTodoListPlugin(),

    // Special Elements
    createImagePlugin(), // Image
    createLinkPlugin(), // Link
    createListPlugin(), // List
    createTablePlugin(), // Table

    // Editing Plugins
    createSoftBreakPlugin(optionsSoftBreakPlugin),
    createExitBreakPlugin(optionsExitBreakPlugin),
    createResetNodePlugin(optionsResetBlockTypePlugin),
    createHorizontalRulePlugin(),
    createSelectOnBackspacePlugin({ allow: [ELEMENT_HR] }),

    // Autoformat markdown syntax to elements (**, #(n))
    createAutoformatPlugin({
      rules: [
        ...autoformatSmartQuotes,
        ...autoformatPunctuation,
        ...autoformatLegal,
        ...autoformatLegalHtml,
        ...autoformatArrow,
        ...autoformatMath,
        ...optionsAutoformat.rules,
        {
          mode: 'block',
          type: ELEMENT_HR,
          match: ['---', '—-', '___ '],
          format: (editor) => {
            setNodes(editor, { type: ELEMENT_HR })
            insertNodes(editor, {
              type: ELEMENT_DEFAULT,
              children: [{ text: '' }]
            })
          }
        }
      ]
    }),
    createDndPlugin(),

    createNodeIdPlugin(optionsCreateNodeIdPlugin),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin(),

    // Custom Plugins
    createBlurSelectionPlugin() as PlatePlugin<PEditor>,

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
