import { DeserializeHtml, getNodeDeserializer, getSlateClass, getPlugin } from '@udecode/plate'
import { ELEMENT_INLINE_BLOCK } from './types'

// * TBD: Make this generic for all custom plugin components.
export const getInlineBlockDeserializer = (): DeserializeHtml => (editor) => {
  const options = getPlugin(editor, ELEMENT_INLINE_BLOCK)
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
