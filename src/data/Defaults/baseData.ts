import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { Contents } from '../../store/useContentStore'
import { FileData, NodeContent } from '../../types/data'
import { generateILinks } from '../../utils/generateComboItem'
import { generateNodeUID } from './idPrefixes'
// import { generateTempId } from './idPrefixes'
//
export const BASE_DRAFT_PATH = 'Draft'
export const BASE_TASKS_PATH = 'Tasks'

const links = [
  ...generateILinks(['doc', 'dev', 'design', '@']),
  {
    path: BASE_DRAFT_PATH,
    nodeid: generateNodeUID(),
    icon: 'ri:draft-line'
  },
  {
    path: BASE_TASKS_PATH,
    nodeid: generateNodeUID(),
    icon: 'ri:task-line'
  }
]

export const defaultContent: NodeContent = {
  type: 'init',
  content: [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}

const contents: Contents = links.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.nodeid]: { type: 'init', content: defaultContent.content, version: -1 }
  }
}, {})

export const DefaultFileData = (version: string): FileData => ({
  version,
  remoteUpdate: true,
  baseNodeId: '@',
  ilinks: links,
  contents,
  linkCache: {},
  tagsCache: {},
  archive: [],
  bookmarks: [],
  todos: {},
  tags: [{ value: 'mex' }],
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
})
