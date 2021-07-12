import markdown from 'remark-parse';
import slate, { serialize as RemarkSlateSerialize } from 'remark-slate';
import { OptionType } from 'remark-slate/dist/deserialize';
import unified from 'unified';

const customNodeTypes = {
  paragraph: 'p',
  block_quote: 'blockquote',
  code_block: 'code_block',
  link: 'a',
  ul_list: 'ul',
  ol_list: 'ol',
  listItem: 'li',
  heading: {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
    5: 'h5',
    6: 'h6',
  },
  emphasis_mark: 'italic',
  strong_mark: 'bold',
  delete_mark: 'strikethrough',
  inline_code_mark: 'code',
  thematic_break: 'thematic_break',
  image: 'img',
};

export const deserializationOptions: OptionType = {
  nodeTypes: customNodeTypes,
  linkDestinationKey: 'url',
  imageSourceKey: 'src',
  imageCaptionKey: 'alt',
};

export const serializationOptions = {
  nodeTypes: customNodeTypes,
};

/** Deserialize Markdown string to a slate plugin document */
export const deserialize = async (content: string): Promise<any[]> => {
  let slateObj: any[] = [];

  unified()
    .use(markdown)
    .use(slate, deserializationOptions)
    .process(content, (err, file) => {
      if (err) throw err;
      slateObj = file.result as any[];
    });

  return slateObj;
};

export const serialize = (slateDoc: any[] | undefined): string => {
  if (slateDoc) {
    const newVal = slateDoc
      .map((v) => RemarkSlateSerialize(v, serializationOptions))
      .join('\n');
    return newVal;
  }
  return '';
};
