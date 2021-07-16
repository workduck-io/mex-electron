import {
  Deserialize,
  getNodeDeserializer,
  getSlateClass,
  getSlatePluginOptions,
} from '@udecode/slate-plugins';
import { ELEMENT_ILINK } from './defaults';

export const getILinkDeserialize = (): Deserialize => (editor) => {
  const options = getSlatePluginOptions(editor, ELEMENT_ILINK);

  return {
    element: getNodeDeserializer({
      type: options.type,
      getNode: (el) => ({
        type: options.type,
        value: el.getAttribute('data-slate-value'),
      }),
      rules: [{ className: getSlateClass(options.type) }],
      ...options.deserialize,
    }),
  };
};
