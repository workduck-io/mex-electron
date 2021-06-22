import {
  createReactPlugin,
  createHistoryPlugin,
  createParagraphPlugin,
  createBlockquotePlugin,
  createCodeBlockPlugin,
  createHeadingPlugin,
  createBoldPlugin,
  createItalicPlugin,
  createUnderlinePlugin,
  createStrikethroughPlugin,
  createCodePlugin,
  createDeserializeMDPlugin,
  createImagePlugin,
  createLinkPlugin,
  createListPlugin,
  createTablePlugin,
} from '@udecode/slate-plugins';

const Plugins = [
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

  // serialization / deseriailization

  // Convert pasted markdown to contents of the editor
  createDeserializeMDPlugin(),
];

export default Plugins;
