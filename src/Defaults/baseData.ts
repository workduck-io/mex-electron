import { generateComboTexts } from '../Editor/Store/sampleTags'
import { FileData } from '../Types/data'

export const DefaultFileData: FileData = {
  ilinks: generateComboTexts(['doc', 'dev', 'design', '@', 'Draft']),
  contents: {
    '@': { type: 'init', content: [{ children: [{ text: '' }] }] },
    doc: { type: 'init', content: [{ children: [{ text: '' }] }] },
    dev: { type: 'init', content: [{ children: [{ text: '' }] }] },
    design: { type: 'init', content: [{ children: [{ text: '' }] }] },
    Draft: { type: 'init', content: [{ children: [{ text: '' }] }] }
  },
  linkCache: {},
  tags: generateComboTexts(['mex']),
  syncBlocks: [],
  userSettings: {
    theme: 'dev',
    spotlight: {
      showSource: false
    }
  },
  snippets: []
}
