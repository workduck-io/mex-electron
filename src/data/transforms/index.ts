import { ArrayTransform, CustomTransformation, DataTransformation, KeysTransformation } from '../../utils/dataTransform'

const v081 = (): CustomTransformation => {
  return {
    type: 'CustomTransformation',
    version: '0.8.1',
    custom: (data) => {
      return { ...data, todo: {} }
    }
  }
}
const v080_alpha_2 = (): KeysTransformation => {
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
    version: '0.8.0-alpha.1',
    keys: {
      ilinks,
      linkCache: {
        type: 'Custom',
        custom: 'ArrayedObjectTransform',
        move: [{ from: 'uid', to: 'nodeid' }]
      },
      tags: {
        type: 'ArrayTransform',
        delete: ['value', 'key'],
        update: [{ key: 'text', value: (tag) => tag.key }]
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

  v080_alpha_2(),
  v081()
]
