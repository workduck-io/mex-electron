// import { getPluginType, getRenderElement } from '@udecode/plate'
import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_SYNC_BLOCK } from '.'
// import { getSyncBlockDeserialize } from './getSyncBlockDeserialize'

/**
 * Enables support for Internal links.
 */
export const createSyncBlockPlugin = (): PlatePlugin => ({
  key: ELEMENT_SYNC_BLOCK,
  isElement: true,
  isInline: true,
  // renderElement: getRenderElement(ELEMENT_SYNC_BLOCK),
  // deserialize: getSyncBlockDeserialize(),
  // inlineTypes: getPluginType(ELEMENT_SYNC_BLOCK),
  // voidTypes: getPluginType(ELEMENT_SYNC_BLOCK),
  then: (editor, { type }) => ({
    deserializeHtml: {
      getNode: (el) => ({
        type,
        value: el.getAttribute('data-slate-value')
      }),
      validNodeName: 'A'
    }
  })
})
