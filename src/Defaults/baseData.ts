import { generateComboTexts, generateILinks } from '../Editor/Store/sampleTags'
import { FileData } from '../Types/data'

const links = generateILinks(['doc', 'dev', 'design', '@', 'Draft'])

export const defaultContent = [{ children: [{ text: '' }] }]

const contents = links.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.uid]: { type: 'init', content: [{ children: [{ text: '' }] }] }
  }
}, {})

export const DefaultFileData: FileData = {
  remoteUpdate: true,
  ilinks: links,
  contents,
  linkCache: {},
  tags: generateComboTexts(['mex']),
  syncBlocks: [],
  templates: [],
  intents: {},
  services: [],
  userSettings: {
    theme: 'dev',
    spotlight: {
      showSource: true
    }
  },
  snippets: []
}
