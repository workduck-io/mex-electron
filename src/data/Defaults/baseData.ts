import { PriorityType, TodoStatus } from '@editor/Components/Todo/types'

import { ELEMENT_TODO_LI } from '@workduck-io/mex-utils'

import { ELEMENT_QA_BLOCK } from '../../editor/Components/QABlock/createQAPlugin'
import { questions } from '../../editor/Components/QABlock/starters'
import { NodeEditorContent } from '../../types/Types'
import { FileData, NodeContent } from '../../types/data'
import { generateILinks } from '../../utils/generateComboItem'
import { draftContent } from '../initial/draftDoc'
import { onboardingContent } from '../initial/onboardingDoc'
import { generateNodeUID, generateTempId, generateTaskEntityId, MEETING_PREFIX } from './idPrefixes'

// import { generateTempId } from './idPrefixes'
//]

export interface Contents {
  // Mapped with nodeid
  [key: string]: NodeContent
}

const randomNumberBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

const ELEMENT_PARAGRAPH = 'p'
export const BASE_DRAFT_PATH = 'Drafts'
export const BASE_TASKS_PATH = 'Daily Tasks'
export const BASE_MEETING_PATH = MEETING_PREFIX
// Note that these are only used for content section
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

// const linksWithSpecialContent = [onboardingLink, draftLink, tasksLink]

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

export const getDefaultTodo = (): {
  entityId: string
  blockId: string
  content: NodeEditorContent
  entityMetadata: { status: TodoStatus; priority: PriorityType; tags: string[]; mentions: any[] }
} => {
  const entityId = generateTaskEntityId()
  const blockId = generateTempId()

  return {
    entityId,
    blockId,
    content: [
      {
        type: ELEMENT_TODO_LI,
        id: blockId,
        entityId,
        children: [
          {
            id: generateTempId(),
            type: ELEMENT_PARAGRAPH,
            text: ''
          }
        ]
      }
    ],
    entityMetadata: {
      status: TodoStatus.todo,
      priority: PriorityType.noPriority,
      tags: [],
      mentions: []
    }
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
  baseNodeId: 'doc',
  ilinks: [],
  contents,
  linkCache: {},
  tagsCache: {},
  archive: [],
  bookmarks: [],
  views: [],
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
