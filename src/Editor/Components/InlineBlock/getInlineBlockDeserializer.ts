// import { Deserialize, getNodeDeserializer, getSlateClass, getPlatePluginOptions } from '@udecode/plate'
// import { ELEMENT_INLINE_BLOCK } from './types'

// // * TBD: Make this generic for all custom plugin components.
// export const getInlineBlockDeserializer = (): Deserialize => (editor) => {
//   const options = getPlatePluginOptions(editor, ELEMENT_INLINE_BLOCK)

//   return {
//     element: getNodeDeserializer({
//       type: options.type,
//       getNode: (el) => ({
//         type: options.type,
//         value: el.getAttribute('data-slate-value')
//       }),
//       rules: [{ className: getSlateClass(options.type) }],
//       ...options.deserialize
//     })
//   }
// }
