// import { getPluginType, getRenderElement } from '@udecode/plate'
import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_ILINK } from './defaults'
// import { getILinkDeserialize } from './getILinkDeserialize'

/**
 * Enables support for Internal links.
 */
export const createILinkPlugin = (): PlatePlugin => ({
  key: ELEMENT_ILINK,
  isElement: true,
  isInline: true,
  then: (editor, { type }) => ({
    deserializeHtml: {
      getNode: (el) => ({
        type,
        url: el.nodeValue
      }),
      validNodeName: 'A'
    }
  })
  // renderElement: getRenderElement(ELEMENT_ILINK),
  // deserialize: getILinkDeserialize(),
  // inlineTypes: getPluginType(ELEMENT_ILINK),
  // voidTypes: getPluginType(ELEMENT_ILINK)
})
