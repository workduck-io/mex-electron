import { Intent, SyncBlockTemplate, SyncStoreIntents } from '../../Editor/Components/SyncBlock'

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
      testIntent: 'issue'
    }
  }
}

export const templates: SyncBlockTemplate[] = [
  {
    id: 'issue',
    title: 'Issue',
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
