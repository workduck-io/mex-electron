import { generateComboTexts } from '../Editor/Store/sampleTags';
import { FileData } from '../Types/data';

export const DefaultFileData: FileData = {
  ilinks: generateComboTexts(['doc', 'dev', 'design', '@']),
  contents: {
    '@': { type: 'init', content: [{ children: [{ text: '' }] }] },
    doc: { type: 'init', content: [{ children: [{ text: '' }] }] },
    dev: { type: 'init', content: [{ children: [{ text: '' }] }] },
    design: { type: 'init', content: [{ children: [{ text: '' }] }] },
  },
  tags: generateComboTexts(['mex']),
  syncBlocks: [],
};
