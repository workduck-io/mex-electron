import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { Contents } from '../Editor/Store/useContentStore'
import { generateComboTexts, generateILinks } from '../Editor/Store/generateComboItem'
import { FileData, NodeContent } from '../Types/data'
// import { generateTempId } from './idPrefixes'

const links = generateILinks(['doc', 'dev', 'design', '@', 'Draft'])

export const defaultContent: NodeContent = {
  type: 'init',
  content: [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}

const contents: Contents = links.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.uid]: { type: 'init', content: defaultContent.content, version: -1 }
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
