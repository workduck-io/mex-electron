import {
  ELEMENT_DEFAULT,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  ELEMENT_PARAGRAPH,
  ELEMENT_TODO_LI,
  PEditor,
  PlatePlugin,
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatPunctuation,
  autoformatSmartQuotes,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createDeserializeHtmlPlugin,
  createDndPlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createHorizontalRulePlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createPlugins,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createUnderlinePlugin,
  insertNodes,
  setNodes
} from '@udecode/plate'
import { ELEMENT_EXCALIDRAW, createExcalidrawPlugin } from '@udecode/plate-excalidraw'
import {
  optionsAutoFormatRule,
  optionsCreateNodeIdPlugin,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
  optionsSelectOnBackspacePlugin,
  optionsSoftBreakPlugin,
  optionsImagePlugin,
  autoformatMath
} from './pluginOptions'

import { ExcalidrawElement } from '../Components/Excalidraw'
import TableWrapper from '../Components/TableWrapper'
// import { TagCombobox } from '../Components/tag/components/TagCombobox';
import { createBlurSelectionPlugin } from './blurSelection'
import { createILinkPlugin } from '../Components/ilink/createILinkPlugin'
import { createInlineBlockPlugin } from '../Components/InlineBlock/createInlineBlockPlugin'
import { createSyncBlockPlugin } from '../Components/SyncBlock/createSyncBlockPlugin'
import { createTagPlugin } from '../Components/tag/createTagPlugin'
import { withBlockOptions } from '../Components/Blocks'
import { withStyledDraggables } from '../Actions/withDraggable'
import { withStyledPlaceHolders } from '../Actions/withPlaceholder'
import createTodoPlugin from '../Components/Todo/createTodoPlugin'
import { createQAPlugin } from '../Components/QABlock/createQAPlugin'

export type PluginOptionType = {
  exclude: {
    dnd: boolean
  }
}

/**
 * Plugin generator
 * @param config Configurations for the plugins, event handlers etc.
 * @returns Array of PlatePlugin
 */

export const generatePlugins = (options: PluginOptionType) => {
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
    // createTodoListPlugin(),

    // Special Elements
    createImagePlugin(optionsImagePlugin), // Image
    createLinkPlugin(), // Link
    createListPlugin(), // List
    createTodoPlugin(),
    createTablePlugin({ component: TableWrapper }), // Table

    // Editing Plugins
    createSoftBreakPlugin(optionsSoftBreakPlugin),
    createExitBreakPlugin(optionsExitBreakPlugin),
    createResetNodePlugin(optionsResetBlockTypePlugin),
    createHorizontalRulePlugin(),
    createSelectOnBackspacePlugin({ options: { query: { allow: [ELEMENT_HR, ELEMENT_EXCALIDRAW] } } }),
    createAlignPlugin({
      inject: {
        props: {
          validTypes: [ELEMENT_PARAGRAPH, ELEMENT_H1, ELEMENT_H2, ELEMENT_H3, ELEMENT_H4, ELEMENT_H5, ELEMENT_H6]
        }
      }
    }),
    // Autoformat markdown syntax to elements (**, #(n))
    createAutoformatPlugin({
      options: {
        rules: [
          ...autoformatSmartQuotes,
          ...autoformatLegal,
          ...autoformatLegalHtml,
          ...autoformatMath,
          ...autoformatArrow,
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

    createQAPlugin(),

    // // For Inline Blocks
    createInlineBlockPlugin(),

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin)
  ]

  const withPlugins = !options?.exclude?.dnd ? [...Plugins, createDndPlugin()] : Plugins

  return withPlugins
}

const useMemoizedPlugins = (components: Record<string, any>, options?: PluginOptionType) => {
  const wrappedComponents = options?.exclude
    ? components
    : withStyledDraggables(withStyledPlaceHolders(withBlockOptions(components, {})))

  const plugins = createPlugins(generatePlugins(options), {
    components: wrappedComponents
  })

  return plugins
}

export default useMemoizedPlugins
