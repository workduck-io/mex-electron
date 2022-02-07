import { ArrayTransform, DataTransformation, KeysTransformation } from '../../utils/dataTransform'

const v070_alpha_3 = (): KeysTransformation => {
  const ilinks: ArrayTransform = {
    type: 'ArrayTransform',
    delete: ['text', 'value'],
    move: [
      { from: 'key', to: 'path' },
      { from: 'uid', to: 'nodeid' }
    ]
  }

  return {
    type: 'KeysTransformation',
    version: 'v0.7.0-alpha.3',
    keys: {
      ilinks,
      linkCache: {
        type: 'Custom',
        custom: 'ArrayedObjectTransform',
        move: [{ from: 'uid', to: 'nodeid' }]
      },
      tags: {
        type: 'ArrayTransform',
        delete: ['key', 'text'],
        update: [{ key: 'value', value: (tag) => tag.key }]
      },

      archive: ilinks
    }
  }
}

export const UpdateVersionTransforms: Array<DataTransformation> = [
  // Add new transformations here
  //
  // For a quick one, use CustomTransformation
  //

  v070_alpha_3()
]
