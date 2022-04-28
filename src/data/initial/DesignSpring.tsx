import { insertId } from '../../utils/lib/content'
import { toLocaleString } from '../../utils/time'
import { generateQuestionId, generateTempId } from '../Defaults/idPrefixes'

export const DesignSprintSnippet = insertId([
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
        value: 'Design'
      },
      {
        text: ' '
      },
      {
        type: 'tag',
        children: [
          {
            text: ''
          }
        ],
        value: 'DesignSprint'
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
        text: 'Welcome and intro'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Give a rundown of what will happen in the following hour and establish some ground rules like:',
        italic: true
      },
      {
        text: ' '
      }
    ]
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Everyone will have the opportunity to share and equal time to talk'
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Everyone’s opinion is important'
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'No blame games focus on improvement'
              }
            ]
          }
        ]
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
        text: 'Design sprint recap'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Summarise the design sprint and significant milestones.',
        italic: true
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
        text: 'What worked well?'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Take 5 minutes to write what went well during the sprint under these categories. Then, spend another 5 minutes discussing those talking points as a team.',
        italic: true
      }
    ]
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Design Sprint Format & Schedule',
                italic: true
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Design Sprint Results',
                italic: true
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Team Collaboration',
                italic: true
              }
            ]
          }
        ]
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
        text: 'What were the challenges?'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Same drill, everyone, individually and in silence, will take 5 minutes to write their answers across the three categories:',
        italic: true
      }
    ]
  },
  {
    type: 'ul',
    children: [
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Design Sprint Format & Schedule',
                italic: true
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Design Sprint Results',
                italic: true
              }
            ]
          }
        ]
      },
      {
        type: 'li',
        children: [
          {
            type: 'lic',
            children: [
              {
                text: 'Team Collaboration',
                italic: true
              }
            ]
          }
        ]
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
        text: 'Things to look out for in the future?'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Jot down suggestions for improvement and ways to avoid the same challenges in the future.',
        italic: true
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
        text: 'Wrap-up'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: 'Thank your colleagues for their time and then conclude the meeting - maybe plan something fun to do :) ',
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
    type: 'blockquote',
    children: [
      {
        text: 'A great piece on retrospectives: ',
        italic: true
      },
      {
        type: 'a',
        url: 'https://www.nngroup.com/articles/ux-retrospectives/',
        children: [
          {
            text: 'UX Retrospective 101',
            underline: true,
            italic: true
          }
        ]
      },
      {
        text: ''
      }
    ]
  }
])
