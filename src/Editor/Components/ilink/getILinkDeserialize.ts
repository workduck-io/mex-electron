import { DeserializeHtml, getNodeDeserializer, getSlateClass, getPlugin } from '@udecode/plate'
import { ELEMENT_ILINK } from './defaults'

export const getILinkDeserialize = (): DeserializeHtml => (editor) => {
  const options = getPlugin(editor, ELEMENT_ILINK)

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
