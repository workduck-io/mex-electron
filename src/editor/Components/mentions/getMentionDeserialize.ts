import { DeserializeHtml } from '@udecode/plate'
import { ELEMENT_MENTION } from './defaults'

export const getMentionDeserialize = (): DeserializeHtml => {
  return {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_MENTION) return

      return {
        type: ELEMENT_MENTION,
        value: el.getAttribute('data-slate-value')
      }
    }
  }
}
