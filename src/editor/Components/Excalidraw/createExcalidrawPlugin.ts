import { createPluginFactory, getSlateClass } from '@udecode/plate-core'

export const ELEMENT_EXCALIDRAW = 'excalidraw'

/**
 * Enables support for Excalidraw drawing tool within a Slate document
 */
export const createExcalidrawPlugin = createPluginFactory({
  key: ELEMENT_EXCALIDRAW,
  isElement: true,
  isVoid: true,
  deserializeHtml: {
    getNode: (el) => ({
      type: ELEMENT_EXCALIDRAW,
      value: el.getAttribute('data-slate-value')
    }),
    rules: [{ validClassName: getSlateClass(ELEMENT_EXCALIDRAW) }]
  }
})
