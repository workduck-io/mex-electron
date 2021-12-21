import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { tourNodeContent } from '../Components/Onboarding/tourNode'
import { generateComboTexts, generateILinks } from '../Editor/Store/sampleTags'
import { FileData } from '../Types/data'
import { generateTempId } from './idPrefixes'

const links = generateILinks(['doc', 'dev', 'design', '@', 'tour', 'Draft'])

export const defaultContent = [{ id: generateTempId(), children: [{ text: '' }], type: ELEMENT_PARAGRAPH }]

const contents = links.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.uid]: { type: 'init', content: cur.key === 'tour' ? tourNodeContent : defaultContent }
  }
}, {})

export const DefaultFileData: FileData = {
  remoteUpdate: true,
  baseNodeId: '@',
  ilinks: links,
  contents,
  linkCache: {},
  tagsCache: {},
  archive: [],
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
