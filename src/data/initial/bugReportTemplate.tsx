import { insertId } from '../../utils/lib/content'
import { generateQuestionId } from '../Defaults/idPrefixes'

export const BugReportTemplate = insertId([
  {
    children: [
      {
        text: 'Speciale Snippete'
      }
    ],
    type: 'h1'
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
    type: 'agent-based-question',
    question: 'This is a speiale Snippete',
    questionId: generateQuestionId(),
    children: [
      {
        text: ''
      }
    ]
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
    type: 'p',
    children: [
      {
        text: 'And this should be added in the init.'
      }
    ]
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
    type: 'p',
    children: [
      {
        text: ''
      },
      {
        type: 'tag',
        children: [
          {
            text: ''
          }
        ],
        value: 'speciale'
      },
      {
        text: ''
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ''
      }
    ]
  }
])
