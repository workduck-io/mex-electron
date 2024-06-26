import { insertId } from '../../utils/lib/content.main'
import { generateQuestionId } from '../Defaults/idPrefixes'

export const DesignSpecSnippet = insertId([
  {
    type: 'p',
    children: [
      {
        text: 'Feature description with embedded prototypes.'
      },
      {
        text: '\n'
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Background & Research'
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Link research docs here',
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
    type: 'h2',
    children: [
      {
        text: 'Why?'
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
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'How?'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '\n'
      }
    ]
  },
  {
    type: 'media_embed',
    children: [
      {
        text: ''
      }
    ],
    url: 'https://workduck.io/'
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
        text: ' '
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Requirements'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: ' '
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Responsive image on touch'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Swipe left-right to access related content'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '\n'
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Measuring Success'
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
        text: '1. NPS on mobile experience'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '2. Retention of users that are using us cross-platform (desktop + mobile)'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '3. # of articles being accessed weekly'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '    - Current benchmark: ~3 articles read per week per user'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '\n'
      }
    ]
  }
])
