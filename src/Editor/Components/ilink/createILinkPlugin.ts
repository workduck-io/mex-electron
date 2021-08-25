import { getRenderElement, getPlatePluginTypes } from '@udecode/plate'
import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_ILINK } from './defaults'
import { getILinkDeserialize } from './getILinkDeserialize'

/**
 * Enables support for Internal links.
 */
export const createILinkPlugin = (): PlatePlugin => ({
  renderElement: getRenderElement(ELEMENT_ILINK),
  deserialize: getILinkDeserialize(),
  inlineTypes: getPlatePluginTypes(ELEMENT_ILINK),
  voidTypes: getPlatePluginTypes(ELEMENT_ILINK),
})
