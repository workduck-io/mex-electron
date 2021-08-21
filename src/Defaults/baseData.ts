import { generateComboTexts } from '../Editor/Store/sampleTags';
import { FileData } from '../Types/data';

export const DefaultFileData: FileData = {
  ilinks: generateComboTexts(['doc', 'dev', 'design', '@']),
  contents: {
    '@': { type: 'editor', content: [{ children: [{ text: '' }] }] },
    doc: { type: 'editor', content: [{ children: [{ text: '' }] }] },
    dev: { type: 'editor', content: [{ children: [{ text: '' }] }] },
    design: { type: 'editor', content: [{ children: [{ text: '' }] }] },
  },
  tags: generateComboTexts(['mex']),
  syncBlocks: [],
  userSettings: {
    theme: 'dev',
  },
};
