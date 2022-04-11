import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { questions } from '../../editor/Components/QABlock/starters'
import { ELEMENT_QA_BLOCK } from '../../editor/Components/QABlock/createQAPlugin'
import { Contents } from '../../store/useContentStore'
import { FileData, NodeContent } from '../../types/data'
import { generateILinks } from '../../utils/generateComboItem'
import { randomNumberBetween } from '../../utils/helpers'
import { generateNodeUID, generateTempId, MEETING_PREFIX } from './idPrefixes'
import { initialSnippets } from '../initial/snippets'
// import { generateTempId } from './idPrefixes'
//
export const BASE_DRAFT_PATH = 'Draft'
export const BASE_TASKS_PATH = 'Tasks'
export const BASE_MEETING_PATH = MEETING_PREFIX

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
  content: [{ id: generateTempId(), type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
  version: -1
}

export const generateDefaultNode = (): NodeContent => {
  return {
    type: 'init',
    content: [{ id: generateTempId(), type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }],
    version: -1
  }
}

export const getRandomQAContent = () => {
  const idx = randomNumberBetween(0, questions.length - 1)
  const pickedQuestion = questions[idx]

  const qaBlockContent = [{ id: generateTempId(), type: ELEMENT_QA_BLOCK, ...pickedQuestion, children: [{ text: '' }] }]

  return qaBlockContent
}

const contents: Contents = links.reduce((prev, cur) => {
  return {
    ...prev,
    [cur.nodeid]: generateDefaultNode()
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
  reminders: [],
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
  snippets: initialSnippets
})
