import { OptionType } from 'remark-slate/dist/deserialize';

import markdown from 'remark-parse';
import slate from 'remark-slate';
import unified from 'unified';

export const serializationOptions: OptionType = {
  nodeTypes: {
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
  },
  linkDestinationKey: 'src',
  imageSourceKey: 'src',
  imageCaptionKey: 'alt',
};

/** Deserialize Markdown string to a slate plugin document */
export const deserialize = async (content: string): Promise<any[]> => {
  let slateObj: any[] = [];

  unified()
    .use(markdown)
    .use(slate, serializationOptions)
    .process(content, (err, file) => {
      if (err) throw err;
      slateObj = file.result as any[];
    });

  return slateObj;
};
