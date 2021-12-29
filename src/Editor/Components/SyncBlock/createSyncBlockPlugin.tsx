import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_SYNC_BLOCK } from '.'
import { getSyncBlockDeserialize } from './getSyncBlockDeserialize'

/**
 * Enables support for Internal links.
 */
export const createSyncBlockPlugin = (): PlatePlugin => ({
  key: ELEMENT_SYNC_BLOCK,
  isElement: true,
  deserializeHtml: getSyncBlockDeserialize(),
  isInline: true,
  isVoid: true
})
