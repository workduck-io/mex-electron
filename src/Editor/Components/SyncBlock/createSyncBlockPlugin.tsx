import { getRenderElement, getPlatePluginTypes } from '@udecode/plate'
import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_SYNC_BLOCK } from '.'
import { getSyncBlockDeserialize } from './getSyncBlockDeserialize'

/**
 * Enables support for Internal links.
 */
export const createSyncBlockPlugin = (): PlatePlugin => ({
  renderElement: getRenderElement(ELEMENT_SYNC_BLOCK),
  deserialize: getSyncBlockDeserialize(),
  inlineTypes: getPlatePluginTypes(ELEMENT_SYNC_BLOCK),
  voidTypes: getPlatePluginTypes(ELEMENT_SYNC_BLOCK),
})
