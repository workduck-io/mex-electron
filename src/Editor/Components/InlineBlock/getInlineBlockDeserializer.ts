import { DeserializeHtml, getSlateClass } from '@udecode/plate'
import { ELEMENT_INLINE_BLOCK } from './types'

// * TBD: Make this generic for all custom plugin components.
export const getInlineBlockDeserializer = (): DeserializeHtml => {
  return {
    isElement: true,
    getNode: (el) => ({
      type: ELEMENT_INLINE_BLOCK,
      value: el.getAttribute('data-slate-value')
    }),
    rules: [{ validClassName: getSlateClass(ELEMENT_INLINE_BLOCK) }],
  }
}
