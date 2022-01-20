import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_TAG } from './defaults'
import { getTagDeserialize } from './getTagDeserialize'

/**
 * Enables support for hypertags.
 */
export const createTagPlugin = (): PlatePlugin => ({
  key: ELEMENT_TAG,
  isElement: true,
  deserializeHtml: getTagDeserialize(),
  isInline: true,
  isVoid: true
})
