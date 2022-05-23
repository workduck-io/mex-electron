import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_ACTION_BLOCK } from './types'

export const createActionPlugin = (): PlatePlugin => ({
  isVoid: true,
  isElement: true,
  deserializeHtml: {
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_ACTION_BLOCK) return

      return {
        value: el.getAttribute('data-slate-value')
      }
    }
  },
  key: ELEMENT_ACTION_BLOCK
})
