import { createActionPlugin } from '@editor/Components/Actions/createActionPlugin'
import { withBlockOptions } from '@editor/Components/Blocks'
import { createBlockModifierPlugin } from '@editor/Components/Blocks/createBlockModifierPlugin'
import { PlateFloatingLink } from '@editor/Components/Floating/FloatingLink'
// eslint-disable-next-line import/no-unresolved
import MediaIFrame, { parseRestMediaUrls } from '@editor/Components/media-embed-ui/src/MediaEmbedElement/MediaIFrame'
import { createMentionPlugin } from '@editor/Components/mentions/createMentionsPlugin'
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
  PlatePlugin,
  autoformatArrow,
  autoformatLegal,
  autoformatLegalHtml,
  autoformatSmartQuotes,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
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
  createParagraphPlugin,
  createPlugins,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTablePlugin,
  createUnderlinePlugin,
  insertNodes,
  setNodes,
  parseIframeUrl,
  parseTwitterUrl,
  parseVideoUrl,
  MediaEmbedVideo,
  MediaEmbedTweet,
  createNodeIdPlugin
} from '@udecode/plate'
import { ELEMENT_EXCALIDRAW, createExcalidrawPlugin } from '@udecode/plate-excalidraw'

import { withStyledDraggables } from '../Actions/withDraggable'
import { withStyledPlaceHolders } from '../Actions/withPlaceholder'
import { ExcalidrawElement } from '../Components/Excalidraw'
import { createInlineBlockPlugin } from '../Components/InlineBlock/createInlineBlockPlugin'
import { createQAPlugin } from '../Components/QABlock/createQAPlugin'
import { createSyncBlockPlugin } from '../Components/SyncBlock/createSyncBlockPlugin'
import TableWrapper from '../Components/TableWrapper'
import createTodoPlugin from '../Components/Todo/createTodoPlugin'
import { createILinkPlugin } from '../Components/ilink/createILinkPlugin'
import { createTagPlugin } from '../Components/tag/createTagPlugin'
// import { TagCombobox } from '../Components/tag/components/TagCombobox';
import { createBlurSelectionPlugin } from './blurSelection'
import { createHighlightTextPlugin } from './highlightText'
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

export type PluginOptionType = {
  exclude: {
    dnd?: boolean
    mentions?: boolean
  }
}

export const linkPlugin = {
  renderAfterEditable: PlateFloatingLink
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
      component: ExcalidrawElement,
      isInline: true
    }) as any,

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
    createLinkPlugin(linkPlugin), // Link
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
    createBlockModifierPlugin(),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin({
      options: {
        transformUrl: parseIframeUrl,
        rules: [
          {
            parser: parseTwitterUrl,
            component: MediaEmbedTweet
          },
          {
            parser: parseVideoUrl,
            component: MediaEmbedVideo
          },
          {
            parser: parseRestMediaUrls,
            component: MediaIFrame
          }
        ]
      }
    }),

    // Custom Plugins
    createBlurSelectionPlugin(),

    // Comboboxes
    createTagPlugin(), // Tags
    createMentionPlugin(), // Mentions
    createILinkPlugin(), // Internal Links ILinks

    // Sync Blocks
    createSyncBlockPlugin(),

    createQAPlugin(),
    createActionPlugin(),

    // // For Inline Blocks
    createInlineBlockPlugin(),

    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),
    createHighlightTextPlugin()
  ]

  const withPlugins = !options?.exclude?.dnd ? [...Plugins, createDndPlugin()] : Plugins

  return withPlugins
}

const useMemoizedPlugins = (components: Record<string, any>, options?: PluginOptionType) => {
  const wrappedComponents = options?.exclude.dnd
    ? components
    : withStyledDraggables(withStyledPlaceHolders(withBlockOptions(components, {})))

  const plugins = createPlugins(generatePlugins(options), {
    components: wrappedComponents
  })

  return plugins
}

export default useMemoizedPlugins
