import { generateComboTexts, generateILinks } from '../Editor/Store/sampleTags'
import { FileData } from '../Types/data'
import { generateTempId } from './idPrefixes'

const links = generateILinks(['doc', 'dev', 'design', '@', 'Draft'])

export const defaultContent = [{ id: generateTempId(), children: [{ text: '' }] }]

const contents = links.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.uid]: { type: 'init', content: defaultContent }
  }
}, {})

export const DefaultFileData: FileData = {
  remoteUpdate: true,
  baseNodeId: '@',
  ilinks: links,
  contents,
  linkCache: {},
  bookmarks: [],
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
