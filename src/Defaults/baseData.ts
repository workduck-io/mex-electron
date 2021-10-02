import { sampleServices } from '../Components/Integrations/sampleServices'
import { generateComboTexts, generateILinks } from '../Editor/Store/sampleTags'
import { FileData } from '../Types/data'
import { intentsData, templates } from './Test/intentsData'

export const DefaultFileData: FileData = {
  remoteUpdate: true,
  ilinks: generateILinks(['doc', 'dev', 'design', '@', 'Draft']),
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
  templates,
  intents: intentsData,
  services: sampleServices,
  userSettings: {
    theme: 'dev',
    spotlight: {
      showSource: true
    }
  },
  snippets: []
}
