import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_SYNC_BLOCK } from '.'

/**
 * Enables support for Internal links.
 */
export const createSyncBlockPlugin = (): PlatePlugin => ({
  key: ELEMENT_SYNC_BLOCK,
  isElement: true,
  isVoid: true,
  // deserializeHtml: getSyncBlockDeserialize(),
  then: (editor, { type }) => ({
    deserializeHtml: {
      rules: [
        {
          validNodeName: '*'
        }
      ],
      getNode: (el: HTMLElement, node) => {
        if (node.type !== ELEMENT_SYNC_BLOCK) return

        const properties = el.getAttribute('data-slate-value')
        const id = el.id

        if (properties) {
          return {
            type,
            id,
            properties
          }
        } else {
          return {
            type,
            id
          }
        }
      }
    }
  }),

  isInline: true
})
