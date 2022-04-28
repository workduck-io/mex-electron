import { insertId } from '../../utils/lib/content'
import { toLocaleString } from '../../utils/time'
import { generateQuestionId, generateTempId } from '../Defaults/idPrefixes'

export const GrowthSnippet = insertId([
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
        value: 'Growth'
      },
      {
        text: ''
      }
    ]
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Wild ideas'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'News and ideas for new growth experiments. Collect feedback from others on the ideas.',
        italic: true
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Link or Embed your Ideation notes here',
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
        text: 'Pitches'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Present wild ideas from the last growth team meeting with additional research. The team votes if ideas should be turned into growth projects.',
        italic: true
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Link accepted ideas here',
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
        text: 'Growth experiment updates'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Share development updates on new growth initiatives.',
        italic: true
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Add Dashboards/Report in webview here',
        italic: true
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        italic: true,
        text: ''
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
    url: 'http://example.com/'
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
        text: 'Metrics review'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Review metrics from running growth initiatives and decide on next steps.',
        italic: true
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Add Dashboards/Report in webview here',
        italic: true
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        italic: true,
        text: ''
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
    url: 'http://example.com/'
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
        text: 'Action items'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'What came out of this meeting? What are your next steps?',
        italic: true
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Set priority and track them in tasks view/move tasks to respective',
        italic: true
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
