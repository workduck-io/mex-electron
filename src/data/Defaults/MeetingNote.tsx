import { ELEMENT_PARAGRAPH } from '@udecode/plate'
import { generateTempId } from './idPrefixes'

const meetingTemplate = [
  {
    id: 'TEMP_4BtGTYtUCrbyUL3CryzPY',
    type: 'h1',
    children: [
      {
        id: 'TEMP_4TXMWTbtDrUBUrJaaGT7j',
        text: 'Meeting'
      }
    ]
  },
  {
    type: 'p',
    children: [
      {
        text: '',
        id: 'TEMP_YV9jR4cU3RzYn8TF6MkQ6'
      }
    ],
    id: 'TEMP_rreh4bxHtjcxKdQwximCJ'
  },
  {
    type: 'h2',
    children: [
      {
        text: 'Updates',
        id: 'TEMP_BwRCa3kapM3G7ykWHLKHT'
      }
    ],
    id: 'TEMP_bcjAU8JcEN6REaeaYtRXg'
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
                text: 'Updates of the team here',
                id: 'TEMP_pWJqtXgf4LxBwYhaAFD6P'
              }
            ],
            id: 'TEMP_aznA4tFUDhchWXaMHrQQr'
          }
        ],
        id: 'TEMP_TMJN7j6Ye36zRGyGwUhie'
      }
    ],
    id: 'TEMP_KUipfzkdkeEgpq9UEcmC6'
  },
  {
    type: 'p',
    children: [
      {
        text: '',
        id: 'TEMP_7mqLdbPVLyUHDifQQCd8z'
      }
    ],
    id: 'TEMP_GTNTX7cqGwLeqLRQDymDw'
  },
  {
    type: 'h2',
    id: 'TEMP_EC4JrkUCMmGRcpHVDm8Xf',
    children: [
      {
        id: 'TEMP_kHk7UMEyCJjqCcCWDwXXd',
        text: 'Agenda'
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
            id: 'TEMP_gcfjJfG6pBhYNm6RCPfDj',
            children: [
              {
                id: 'TEMP_KYyi6TeNez9kUL6ERwMTe',
                text: 'List items for agenda here'
              }
            ]
          }
        ],
        id: 'TEMP_rqrA8RGrUPj9UkezPtXdU'
      }
    ],
    id: 'TEMP_wLLmYaLaK6mNdW9QwmRH7'
  },
  {
    type: 'p',
    children: [
      {
        text: '',
        id: 'TEMP_KYyi6TeNez9kUL6ERwMTe'
      }
    ],
    id: 'TEMP_8DyKF9h3JLkQLM8Yn9WzL'
  },
  {
    type: 'h2',
    id: 'TEMP_APiBpRxBQbK34ne3pNcth',
    children: [
      {
        id: 'TEMP_4Rrd3BMDM7RUFyACAtyPK',
        text: 'Tasks'
      }
    ]
  },
  {
    type: 'action_item',
    children: [
      {
        text: 'Create tasks here',
        id: 'TEMP_CrK3KBDBFPVXQAmkwHHjj'
      }
    ],
    id: 'TEMP_h4abtRHPcEKn7a4UWJg9V'
  },
  {
    type: 'p',
    id: 'TEMP_WqTbNe9twFVKnQRKEkt7z',
    children: [
      {
        id: 'TEMP_mA9LPMdJiA3F6fDf8JENt',
        text: ''
      }
    ]
  },
  {
    type: 'h2',
    id: 'TEMP_tcj7KeRyBkaMnhyUYfyhU',
    children: [
      {
        id: 'TEMP_TQUiVTCCd3JEyrhhzAYfN',
        text: 'Questions'
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
                text: 'Any Questions asked?',
                id: 'TEMP_UViFeHxMETgcNPUMyqL8n'
              }
            ],
            id: 'TEMP_Ya9bhwfbK3BHhJxteR4jD'
          }
        ],
        id: 'TEMP_BCrbYKXEHFTjYtEh6rAFG'
      }
    ],
    id: 'TEMP_UP9wB7iRBLqzyaUWFWAwK'
  },
  {
    type: 'p',
    id: 'TEMP_yRG6fVFiP3ANUharkwjxY',
    children: [
      {
        id: 'TEMP_WiAhmngP4pbeKDVaiNqGk',
        text: ''
      }
    ]
  }
]

const insertId = (content: any[]) => {
  if (content.length === 0) {
    return content
  }
  return content.map((item) => {
    if (item.children) item.children = insertId(item.children)
    return {
      ...item,
      id: generateTempId()
    }
  })
}

export const MeetingSnippetContent = insertId(meetingTemplate)
