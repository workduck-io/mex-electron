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
    getNode: (el: HTMLElement, node) => {
      if (node.type !== ELEMENT_EXCALIDRAW) return

      return {
        type: ELEMENT_EXCALIDRAW,
        value: el.getAttribute('data-slate-value')
      }
    }
  }
})
