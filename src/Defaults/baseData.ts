import { generateComboTexts } from '../Editor/Store/sampleTags';
import { FileData } from '../Types/data';

export const DefaultFileData: FileData = {
  ilinks: generateComboTexts(['doc', 'dev', 'design']),
  contents: {
    doc: { type: 'init', content: undefined },
    dev: { type: 'init', content: undefined },
    design: { type: 'init', content: undefined },
  },
  tags: generateComboTexts(['mex']),
};
