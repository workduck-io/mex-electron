import { DeserializeHtml } from '@udecode/plate'
import { ELEMENT_TAG } from './defaults'

export const getTagDeserialize = (): DeserializeHtml => {
  return {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_TAG) return

      return {
        type: ELEMENT_TAG,
        value: el.getAttribute('data-slate-value')
      }
    }
  }
}
