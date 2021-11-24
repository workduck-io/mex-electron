import {
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodeBlockPlugin,
  createCodePlugin,
  createDeserializeHtmlPlugin,
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
  createPlugins,
  createReactPlugin,
  createResetNodePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createTablePlugin,
  createUnderlinePlugin,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  PlatePlugin,
  withProps
} from '@udecode/plate'
import { useMemo } from 'react'
import { ILinkElement } from '../Components/ilink/components/ILinkElement'
import { ELEMENT_ILINK } from '../Components/ilink/defaults'
import { ELEMENT_INLINE_BLOCK } from '../Components/InlineBlock/types'
import LinkElement from '../Components/Link'
import { MediaEmbedElement } from '../Components/media-embed-ui/src'
import { ELEMENT_SYNC_BLOCK, SyncBlock } from '../Components/SyncBlock'
import { TagElement } from '../Components/tag/components/TagElement'
import { ELEMENT_TAG } from '../Components/tag/defaults'
import {
  optionsAutoformat,
  optionsCreateNodeIdPlugin,
  optionsExitBreakPlugin,
  optionsResetBlockTypePlugin,
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
    createSoftBreakPlugin(optionsSoftBreakPlugin), // options also exist, not passed
    createExitBreakPlugin(optionsExitBreakPlugin),
    createResetNodePlugin(optionsResetBlockTypePlugin),

    // Autoformat markdown syntax to elements (**, #(n))
    createAutoformatPlugin(optionsAutoformat),

    createNodeIdPlugin(optionsCreateNodeIdPlugin),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin()

    // Custom Plugins
    //
    // createBlurSelectionPlugin() as PlatePlugin<PlateEditor>,

    // // Comboboxes
    // createTagPlugin(), // Tags
    // createILinkPlugin(), // Internal Links ILinks

    // // Sync Blocks
    // createSyncBlockPlugin(),

    // // For Inline Blocks - Embeds of nodes
    // createInlineBlockPlugin(),

    // createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin)
  ]

  Plugins.push(createDeserializeHtmlPlugin({ plugins: Plugins }))

  return Plugins
}

const useMemoizedPlugins = () => {
  return useMemo(
    () =>
      createPlugins(generatePlugins(), {
        components: {
          [ELEMENT_LINK]: withProps(LinkElement, {
            as: 'a'
          }),
          [ELEMENT_TAG]: TagElement as any,
          [ELEMENT_ILINK]: ILinkElement as any,
          [ELEMENT_INLINE_BLOCK]: ILinkElement as any,
          [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any,
          [ELEMENT_SYNC_BLOCK]: SyncBlock as any
        }
      }),
    []
  )
}

export default useMemoizedPlugins
