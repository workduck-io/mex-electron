// import { getPluginType, getRenderElement } from '@udecode/plate'
import { PlatePlugin } from '@udecode/plate-core'
// import { getInlineBlockDeserializer } from './getInlineBlockDeserializer'
import { ELEMENT_INLINE_BLOCK } from './types'

export const createInlineBlockPlugin = (): PlatePlugin => ({
  key: ELEMENT_INLINE_BLOCK
  // renderElement: getRenderElement(ELEMENT_INLINE_BLOCK),
  // deserialize: getInlineBlockDeserializer(),
  // inlineTypes: getPluginType(ELEMENT_INLINE_BLOCK),
  // voidTypes: getPluginType(ELEMENT_INLINE_BLOCK)
})
