import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { questions } from '../../editor/Components/QABlock/starters'
import { ELEMENT_QA_BLOCK } from '../../editor/Components/QABlock/createQAPlugin'
import { Contents } from '../../store/useContentStore'
import { FileData, NodeContent } from '../../types/data'
import { generateILinks } from '../../utils/generateComboItem'
import { randomNumberBetween } from '../../utils/helpers'
import { generateNodeUID, generateTempId, MEETING_PREFIX } from './idPrefixes'
import { initialSnippets } from '../initial/snippets'
import { onboardingContent } from '../initial/onboardingDoc'
import { draftContent } from '../initial/draftDoc'
// import { generateTempId } from './idPrefixes'
//
export const BASE_DRAFT_PATH = 'Drafts'
export const BASE_TASKS_PATH = 'Tasks'
export const BASE_MEETING_PATH = MEETING_PREFIX
const links = generateILinks(['doc', 'dev', 'design', '@'])

export const onboardingLink = {
  path: 'Onboarding',
  nodeid: generateNodeUID()
}

const tasksLink = {
  path: BASE_TASKS_PATH,
  nodeid: generateNodeUID(),
  icon: 'ri:task-line'
}

const draftLink = {
  path: BASE_DRAFT_PATH,
  nodeid: generateNodeUID(),
  icon: 'ri:draft-line'
}

const linksWithSpecialContent = [onboardingLink, draftLink, tasksLink]

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

const contents: Contents = links.reduce(
  (prev, cur) => {
    return {
      ...prev,
      [cur.nodeid]: generateDefaultNode()
    }
  },
  {
    [onboardingLink.nodeid]: onboardingContent,
    [draftLink.nodeid]: draftContent,
    [tasksLink.nodeid]: generateDefaultNode()
  }
)

export const DefaultFileData = (version: string): FileData => ({
  version,
  remoteUpdate: true,
  baseNodeId: '@',
  ilinks: [],
  contents,
  linkCache: {},
  tagsCache: {},
  archive: [],
  bookmarks: [],
  todos: {},
  reminders: [],
  sharedNodes: [],
  tags: [{ value: 'mex' }],
  syncBlocks: [],
  templates: [],
  intents: {},
  services: [],
  userSettings: {
    theme: 'xeM',
    spotlight: {
      showSource: true
    }
  },
  snippets: []
})
