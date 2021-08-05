import {
  Deserialize,
  getNodeDeserializer,
  getSlateClass,
  getPlatePluginOptions,
} from '@udecode/plate';
import { ELEMENT_SYNC_BLOCK } from '.';

export const getSyncBlockDeserialize = (): Deserialize => (editor) => {
  const options = getPlatePluginOptions(editor, ELEMENT_SYNC_BLOCK);

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
