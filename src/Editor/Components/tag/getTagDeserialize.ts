import { DeserializeHtml, getNodeDeserializer, getSlateClass, getPlugin } from '@udecode/plate'
import { ELEMENT_TAG } from './defaults'

export const getTagDeserialize = (): DeserializeHtml => (editor) => {
  const options = getPlugin(editor, ELEMENT_TAG)

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
