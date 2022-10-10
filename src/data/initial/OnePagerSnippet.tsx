import { insertId } from '../../utils/lib/content.main'
import { generateQuestionId } from '../Defaults/idPrefixes'

export const OnePagerSnippet = insertId([
  {
    type: 'h1',
    children: [
      {
        text: '[Project Title]'
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
        text: 'Description',
        bold: true
      },
      {
        text: ': What is it?'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '',
        bold: true
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        bold: true,
        text: 'Problem'
      },
      {
        text: ': What problem is this solving?'
      }
    ]
  },
  {
    type: 'agent-based-question',
    question: 'Link useful research, such as competitive analysis as notes, metrics as embeds ',
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
        text: 'Why',
        bold: true
      },
      {
        text: ': How do we know this is a real problem and worth solving?'
      },
      {
        text: '\n'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Success',
        bold: true
      },
      {
        text: ': How do we know if we’ve solved this problem?'
      },
      {
        text: '\n'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Audience',
        bold: true
      },
      {
        text: ': Who are we building for?'
      },
      {
        text: '\n'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'What',
        bold: true
      },
      {
        text: ': Roughly, what does this look like in the product?'
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
        text: 'How',
        bold: true
      },
      {
        text: ': What is the experiment plan?'
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
        text: 'When',
        bold: true
      },
      {
        text: ': When does it ship and what are the milestones? '
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Include status and priority + reminders',
        italic: true
      },
      {
        text: ' '
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
