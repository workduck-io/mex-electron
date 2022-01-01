import { DeserializeHtml, getSlateClass, getPlugin } from '@udecode/plate'
import { ELEMENT_INLINE_BLOCK } from './types'

// * TBD: Make this generic for all custom plugin components.
export const getInlineBlockDeserializer = (): DeserializeHtml => {
  return {
    isElement: true,
    getNode: (el) => ({
      value: el.getAttribute('data-slate-value')
    })
  }
}
