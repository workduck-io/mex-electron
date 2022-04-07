import { PlatePlugin } from '@udecode/plate-core'
import { DeserializeHtml } from '@udecode/plate'

export const ELEMENT_QA_BLOCK = 'agent-based-question'

export const qaBlockDeserializer = (): DeserializeHtml => {
  return {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_QA_BLOCK) return

      return {
        value: el.getAttribute('data-slate-value')
      }
    }
  }
}

export const createQAPlugin = (): PlatePlugin => ({
  key: ELEMENT_QA_BLOCK,
  isElement: true,
  deserializeHtml: qaBlockDeserializer(),
  isVoid: true
})
