import { insertId } from '../../utils/lib/content'
import { toLocaleString } from '../../utils/time'
import { generateQuestionId, generateTempId } from '../Defaults/idPrefixes'

export const PRDTemplate = insertId([
  {
    children: [{ text: '' }, { type: 'tag', children: [{ text: '' }], value: 'PRD' }, { text: ' Title' }],
    type: 'h1'
  },
  { type: 'p', children: [{ text: '' }] },
  { type: 'p', children: [{ text: 'Description:', bold: true }, { text: ' A short description' }, { text: '.' }] },
  {
    type: 'p',
    children: [
      { text: 'Goal:', bold: true },
      { text: ' Explain why are you building this and what do you hope to accomplish.' }
    ]
  },
  {
    type: 'p',
    children: [{ text: '' }]
  },
  {
    type: 'h2',
    children: [{ text: 'Changelog' }]
  },
  {
    type: 'p',
    children: [{ text: 'Changelog of the PRD' }]
  },
  {
    type: 'agent-based-question',
    question: 'Add Changelogs here',
    questionId: generateQuestionId(),
    children: [{ text: '' }]
  },
  {
    type: 'p',
    children: [{ text: '' }]
  },
  {
    type: 'h2',
    children: [{ text: 'Features' }]
  },
  {
    type: 'p',
    children: [
      { text: 'For each feature, you should include a ' },
      { text: 'description, goal and use case at a minimum. ' }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Additional details may be helpful or necessary depending on the complexity of the feature, such as out-of-scope items.'
      }
    ]
  },
  { type: 'p', children: [{ text: '' }] },
  {
    type: 'ol',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              { text: ' Cool Feature\n' },
              { text: 'Description:', bold: true },
              { text: ' Describe the Feature\n' },
              { text: 'Goal: ', bold: true },
              { text: 'The goal to be achieved\n' },
              { text: 'Use Case: ', bold: true },
              { text: 'The use case of the feature' }
            ]
          }
        ]
      }
    ]
  },
  { type: 'p', children: [{ text: '' }] },
  { type: 'h2', children: [{ text: 'UX Flow & Design Notes' }] },
  {
    type: 'p',
    children: [{ text: 'List out what the main flows are and what special things to be remembered for design.' }]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Assumptions, Constraints & Dependencies'
      }
    ]
  },
  {
    type: 'p',
    children: [
      { text: 'List ' },
      { text: 'out what is expected of users, any limits for the implementation to be ' },
      { text: 'aware of and any outside elements required for the final solution to be ' },
      { text: 'functional.' }
    ]
  },
  { type: 'p', children: [{ text: '' }] },
  { type: 'h2', children: [{ text: 'Related' }] },
  {
    type: 'agent-based-question',
    question: 'Add Related Notes here',
    questionId: generateQuestionId(),
    children: [{ text: '' }]
  },
  { type: 'p', children: [{ text: '' }] },
  { type: 'p', children: [{ text: '' }] }
])
