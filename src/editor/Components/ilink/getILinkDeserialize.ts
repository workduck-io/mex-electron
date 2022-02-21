import { DeserializeHtml } from '@udecode/plate'
import { ELEMENT_ILINK } from './defaults'

export const getILinkDeserialize = (): DeserializeHtml => {
  return {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_ILINK) return

      return {
        value: el.getAttribute('data-slate-value')
      }
    }
  }
}
