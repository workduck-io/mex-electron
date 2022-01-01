import { DeserializeHtml, getSlateClass, getPlugin } from '@udecode/plate'
import { ELEMENT_ILINK } from './defaults'

export const getILinkDeserialize = (): DeserializeHtml => {
  return {
    getNode: (el) => ({
      value: el.getAttribute('data-slate-value')
    })
  }
}
