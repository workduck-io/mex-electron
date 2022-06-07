import { Snippet } from '../../store/useSnippetStore'
import { ArrayTransform, CustomTransformation, DataTransformation, KeysTransformation } from '../../utils/dataTransform'
import { initialSnippets } from '../initial/snippets'

export const ForceLogutVersion = '0.11.0-alpha.1'

const v0120 = (): CustomTransformation => {
  return {
    type: 'CustomTransformation',
    version: '0.12.0-alpha.0',
    custom: (data) => {
      if (!data.sharedNodes) return { ...data, sharedNodes: [] }
      return data
    }
  }
}

const v0901 = (): CustomTransformation => {
  return {
    type: 'CustomTransformation',
    version: '0.9.0-alpha.1',
    custom: (data) => {
      if (!data.reminders) return { ...data, reminders: [] }
      return data
    }
  }
}
const v081 = (): CustomTransformation => {
  return {
    type: 'CustomTransformation',
    version: '0.8.1',
    custom: (data) => {
      if (!data.todos) return { ...data, todos: {} }

      return data
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

const UpdateTemplateSnippets = (): CustomTransformation => {
  return {
    type: 'CustomTransformation',
    version: '*',
    custom: (data) => {
      // initialSnippets
      // if (!data.reminders) return { ...data, reminders: [] }
      // console.log('UpdateTemplateSnippets', data)
      if (!data.snippets) return { ...data, snippets: initialSnippets }
      const prevSnippetsTitles: string[] = data.snippets ? data.snippets.map((snippet: Snippet) => snippet.title) : []
      const updatedSnippets = initialSnippets.reduce((ps, s) => {
        if (prevSnippetsTitles.includes(s.title)) {
          return ps
          // const newSnippet = initialSnippets.find((snippet) => snippet.title === s.title)
          // const removedSnippets = ps.filter((snippet) => snippet.title !== s.title)
          // if (newSnippet) {
          //   return [...removedSnippets, newSnippet]
          // }
        }
        return [...ps, s]
      }, data.snippets as Snippet[])
      return { ...data, snippets: updatedSnippets }
    }
  }
}

export const UpdateVersionTransforms: Array<DataTransformation> = [
  // Add new transformations here

  // For a quick one, use CustomTransformation
  //

  v080_alpha_2(),
  v081(),
  v0901(),
  v0120()
]

export const DefaultTransforms: Array<DataTransformation> = [
  // Transforms that are applied always
  // (even if the version is not the latest)
  // These are applied at the end of all previous transformations
  UpdateTemplateSnippets()
]
