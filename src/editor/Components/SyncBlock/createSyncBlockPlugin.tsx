import { PlatePlugin, getSlateClass } from '@udecode/plate-core'
import { ELEMENT_SYNC_BLOCK } from '.'
import { getSyncBlockDeserialize } from './getSyncBlockDeserialize'

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
          validNodeName: '*',
          validClassName: getSlateClass(ELEMENT_SYNC_BLOCK)
        }
      ],
      getNode: (el: HTMLElement) => {
        const properties = el.getAttribute('data-slate-value')
        const id = el.id
        // const properties = el.getAttribute()

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
