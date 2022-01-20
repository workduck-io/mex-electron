import { DeserializeHtml, getSlateClass } from '@udecode/plate'
import { ELEMENT_TAG } from './defaults'

export const getTagDeserialize = (): DeserializeHtml => {
  return {
    getNode: (el) => ({
      type: ELEMENT_TAG,
      value: el.getAttribute('data-slate-value')
    }),
    rules: [{ validClassName: getSlateClass(ELEMENT_TAG) }]
  }
}
