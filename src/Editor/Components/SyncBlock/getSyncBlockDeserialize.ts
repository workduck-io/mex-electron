import { DeserializeHtml, getSlateClass } from '@udecode/plate'
import { ELEMENT_SYNC_BLOCK } from '.'

export const getSyncBlockDeserialize = (): DeserializeHtml => {
  return {
    getNode: (el) => ({
      type: ELEMENT_SYNC_BLOCK,
      value: el.getAttribute('data-slate-value')
    }),
    rules: [{ validClassName: getSlateClass(ELEMENT_SYNC_BLOCK) }]
  }
}
