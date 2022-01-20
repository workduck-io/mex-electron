import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_INLINE_BLOCK } from './types'
import { getInlineBlockDeserializer } from './getInlineBlockDeserializer'

export const createInlineBlockPlugin = (): PlatePlugin => ({
  isElement: true,
  deserializeHtml: getInlineBlockDeserializer(),
  isInline: true,
  isVoid: true,
  key: ELEMENT_INLINE_BLOCK
})
