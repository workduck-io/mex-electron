import { getRenderElement, getPlatePluginTypes } from '@udecode/plate'
import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_INLINE_BLOCK } from './types'
import { getInlineBlockDeserializer } from './getInlineBlockDeserializer'

export const createInlineBlockPlugin = (): PlatePlugin => ({
  renderElement: getRenderElement(ELEMENT_INLINE_BLOCK),
  deserialize: getInlineBlockDeserializer(),
  inlineTypes: getPlatePluginTypes(ELEMENT_INLINE_BLOCK),
  voidTypes: getPlatePluginTypes(ELEMENT_INLINE_BLOCK)
})
