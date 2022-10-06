import ActionBlock from '@editor/Components/Actions'
import { createActionPlugin } from '@editor/Components/Actions/createActionPlugin'
import { ELEMENT_ACTION_BLOCK } from '@editor/Components/Actions/types'
import { createBlockModifierPlugin } from '@editor/Components/Blocks/createBlockModifierPlugin'
import { createInlineBlockPlugin } from '@editor/Components/InlineBlock/createInlineBlockPlugin'
import Todo from '@editor/Components/Todo'
import createTodoPlugin from '@editor/Components/Todo/createTodoPlugin'
import { ILinkElement } from '@editor/Components/ilink/components/ILinkElement'
import { createILinkPlugin } from '@editor/Components/ilink/createILinkPlugin'
import { ELEMENT_ILINK } from '@editor/Components/ilink/defaults'
import { MediaEmbedElement } from '@editor/Components/media-embed-ui/src'
import MediaIFrame, { parseRestMediaUrls } from '@editor/Components/media-embed-ui/src/MediaEmbedElement/MediaIFrame'
import { MentionElement } from '@editor/Components/mentions/components/MentionElement'
import { createMentionPlugin } from '@editor/Components/mentions/createMentionsPlugin'
import { TagElement } from '@editor/Components/tag/components/TagElement'
import { createTagPlugin } from '@editor/Components/tag/createTagPlugin'
import { ELEMENT_TAG } from '@editor/Components/tag/defaults'
import { createBlurSelectionPlugin } from '@editor/Plugins/blurSelection'
import {
  optionsCreateNodeIdPlugin,
  optionsImagePlugin,
  optionsSelectOnBackspacePlugin
} from '@editor/Plugins/pluginOptions'
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
  MediaEmbedTweet
} from '@udecode/plate'
import { createExcalidrawPlugin, ExcalidrawElement } from '@udecode/plate-excalidraw'
import { createHighlightPlugin } from '@udecode/plate-highlight'

import { ELEMENT_TODO_LI, mog } from '@workduck-io/mex-utils'

const generateTodoPlugins = () => {
  return [
    // elements
    createParagraphPlugin(), // paragraph element

    createExcalidrawPlugin({
      component: ExcalidrawElement,
      isInline: true
    }) as any,
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
    createTodoPlugin(true)(),
    createSelectOnBackspacePlugin(optionsSelectOnBackspacePlugin),

    // Comboboxes
    createTagPlugin(), // Tags
    createMentionPlugin(), // Mentions
    createILinkPlugin(), // Internal Links ILinks
    createActionPlugin(),
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
    [ELEMENT_MEDIA_EMBED]: MediaEmbedElement as any,
    [ELEMENT_ACTION_BLOCK]: ActionBlock
  })

export const getTodoPlugins = () => {
  const plugins = createPlugins(generateTodoPlugins(), { components: getComponents() })
  return plugins
}
