import {
  createParagraphPlugin,
  createImagePlugin,
  createLinkPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createPlateUI,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_MENTION,
  ELEMENT_PARAGRAPH,
  LinkElement,
  StyledElement,
  withProps,
  createSelectOnBackspacePlugin,
  createPlugins,
  createSingleLinePlugin,
  parseIframeUrl,
  parseTwitterUrl,
  MediaEmbedVideo,
  parseVideoUrl,
  MediaEmbedTweet,
  MediaEmbedElement,
  MentionElement,
  createTodoListPlugin
} from '@udecode/plate'
import { createHighlightPlugin } from '@udecode/plate-highlight'

import { ELEMENT_ILINK, ELEMENT_TAG, ELEMENT_TODO_LI } from '@workduck-io/mex-utils'

// import { createBlurSelectionPlugin, MediaEmbedElement, MediaIFrame, parseRestMediaUrls } from '@mexit/shared'
import { createBlurSelectionPlugin} from '@editor/Plugins/blurSelection'
import MediaIFrame, { parseRestMediaUrls } from '@editor/Components/media-embed-ui/src/MediaEmbedElement/MediaIFrame'

import { TagElement } from '@editor/Components/tag/components/TagElement'
import { createBlockModifierPlugin } from '@editor/Components/Blocks/createBlockModifierPlugin'
import { createILinkPlugin } from '@editor/Components/ilink/createILinkPlugin'
import { createInlineBlockPlugin } from '@editor/Components/InlineBlock/createInlineBlockPlugin'
import { createTagPlugin } from '@editor/Components/tag/createTagPlugin'
import Todo from '@ui/components/Todo'
import { optionsCreateNodeIdPlugin, optionsImagePlugin, optionsSelectOnBackspacePlugin } from '@editor/Plugins/pluginOptions'
import createTodoPlugin from '@editor/Components/Todo/createTodoPlugin'
import { createMentionPlugin } from '@editor/Components/mentions/createMentionsPlugin'
import { ILinkElement } from '@editor/Components/ilink/components/ILinkElement'



const generateTodoPlugins = () => {
  return [
    // elements
    createParagraphPlugin(), // paragraph element

    createSelectOnBackspacePlugin(),
    createImagePlugin(optionsImagePlugin), // Image
    createLinkPlugin(), // Link

    // Marks
    createBoldPlugin(), // bold mark
    createItalicPlugin(), // italic mark
    createUnderlinePlugin(), // underline mark
    createStrikethroughPlugin(), // strikethrough mark
    createHighlightPlugin(), // highlight mark
    // createTodoListPlugin(),
    createNodeIdPlugin(optionsCreateNodeIdPlugin),
    createBlockModifierPlugin(),

    // serialization / deseriailization

    // Convert pasted markdown to contents of the editor
    // createDeserializeMDPlugin(),

    // Media and link embed
    createMediaEmbedPlugin({
      isInline: true,
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
    createTodoPlugin(),
    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),

    // Comboboxes
    createTagPlugin(), // Tags
    createMentionPlugin(), // Mentions
    createILinkPlugin(), // Internal Links ILinks
    createInlineBlockPlugin(),
    createSingleLinePlugin()
  ]
}

export const getComponents = () =>
  createPlateUI({
    [ELEMENT_LINK]: withProps(LinkElement, {
      as: 'a'
    }),
    [ELEMENT_PARAGRAPH]: withProps(StyledElement, {
      styles: {
        root: {
          margin: '0.1rem 0 0'
        }
      }
    }),
    [ELEMENT_TODO_LI]: Todo as any,
    [ELEMENT_TAG]: TagElement as any,
    [ELEMENT_MENTION]: MentionElement as any,
    [ELEMENT_ILINK]: ILinkElement as any,
    [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any
  })

export const getTodoPlugins = () => {
  const plugins = createPlugins(generateTodoPlugins(), { components: getComponents() })
  return plugins
}