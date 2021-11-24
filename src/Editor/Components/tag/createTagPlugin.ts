import { getPluginType, pipeRenderElement } from '@udecode/plate'
import { PlatePlugin } from '@udecode/plate-core'
import { ELEMENT_TAG } from './defaults'
// import { getTagDeserialize } from './getTagDeserialize'

/**
 * Enables support for hypertags.
 */
export const createTagPlugin = (): PlatePlugin => ({
  key: ELEMENT_TAG,
  isElement: true,
  isInline: true,
  then: (editor, { type }) => ({
    deserializeHtml: {
      getNode: (el) => ({
        type,
        value: el.getAttribute('data-slate-value')
      }),
      validNodeName: 'A'
    }
  })
  //   renderElement: pipeRenderElement(ELEMENT_TAG),
  //   deserialize: getTagDeserialize(),
  //   inlineTypes: getPluginType(ELEMENT_TAG),
  //   voidTypes: getPluginType(ELEMENT_TAG)
})
