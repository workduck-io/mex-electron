import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  // createDeserializeMDPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createDndPlugin,
  createHighlightPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createTodoListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
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
  insertNodes,
  createPlugins
} from '@udecode/plate'

import { withStyledDraggables } from '../Actions/withDraggable'
import { withStyledPlaceHolders } from '../Actions/withPlaceholder'
import components from '../Components/components'

import { createExcalidrawPlugin, ExcalidrawElement, ELEMENT_EXCALIDRAW } from '@udecode/plate-excalidraw'

import { createILinkPlugin } from '../Components/ilink/createILinkPlugin'
import { createInlineBlockPlugin } from '../Components/InlineBlock/createInlineBlockPlugin'
import { createSyncBlockPlugin } from '../Components/SyncBlock/createSyncBlockPlugin'
import { createTagPlugin } from '../Components/tag/createTagPlugin'
// import { TagCombobox } from '../Components/tag/components/TagCombobox';
// import { createTagPlugin } from '../Components/tag/createTagPlugin';
import { createBlurSelectionPlugin } from './blurSelection'
import {
  optionsAutoFormatRule,
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

    // elements
    createParagraphPlugin(), // paragraph element
    createBlockquotePlugin(), // blockquote element
    createCodeBlockPlugin(), // code block element
    createHeadingPlugin(), // heading elements

    createExcalidrawPlugin({
      component: ExcalidrawElement
    }),

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
    createSelectOnBackspacePlugin({ options: { query: { allow: [ELEMENT_HR, ELEMENT_EXCALIDRAW] } } }),

    // Autoformat markdown syntax to elements (**, #(n))
    createAutoformatPlugin({
      options: {
        rules: [
          ...autoformatSmartQuotes,
          ...autoformatPunctuation,
          ...autoformatLegal,
          ...autoformatLegalHtml,
          ...autoformatArrow,
          ...autoformatMath,
          ...optionsAutoFormatRule,
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
      }
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

  return Plugins
}

const useMemoizedPlugins = () => {
  return createPlugins(generatePlugins(), { components: withStyledPlaceHolders(withStyledDraggables(components)) })
}

export default useMemoizedPlugins
