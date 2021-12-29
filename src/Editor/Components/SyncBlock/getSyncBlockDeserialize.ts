import { DeserializeHtml, getNodeDeserializer, getSlateClass, getPlugin } from '@udecode/plate'
import { ELEMENT_SYNC_BLOCK } from '.'

export const getSyncBlockDeserialize = (): DeserializeHtml => (editor) => {
  const options = getPlugin(editor, ELEMENT_SYNC_BLOCK)
  return {
    element: getNodeDeserializer({
      type: options.type,
      getNode: (el) => ({
        type: options.type,
        value: el.getAttribute('data-slate-value')
      }),
      rules: [{ className: getSlateClass(options.type) }],
      ...options.deserializeHtml
    })
  }
}
