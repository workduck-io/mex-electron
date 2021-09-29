import { SyncBlockTemplate, SyncStoreIntents } from '../../Editor/Components/SyncBlock'

export const intentsData: SyncStoreIntents = {
  '@': {
    intents: [
      {
        service: 'github',
        type: 'repo',
        value: 'issue#124e'
      },
      {
        service: 'mex',
        type: 'mex',
        value: 'node'
      }
    ],
    intentGroups: {
      testIntent: {
        templateId: 'issue',
        intents: [
          {
            service: 'github',
            type: 'repo',
            value: '#kjdjdkfsh'
          },

          {
            service: 'mex',
            type: 'mex',
            value: 'archangelina'
          }
        ]
      }
    }
  }
}

export const templates: SyncBlockTemplate[] = [
  {
    id: 'issue',
    title: 'Issue',
    command: 'issue',
    description: 'This is a description',
    intents: [
      {
        service: 'github',
        type: 'repo'
      },

      {
        service: 'mex',
        type: 'mex'
      }
    ]
  }
]
