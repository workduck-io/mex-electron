import { SyncBlockTemplate, SyncStoreIntents } from '../../Editor/Components/SyncBlock'

export const intentsData: SyncStoreIntents = {
  '@': {
    intents: [
      {
        service: 'github',
        type: 'repo',
        name: 'Issue #124',
        value: 'issue#124e'
      },
      {
        service: 'mex',
        type: 'mex',
        name: 'Node',
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
            name: 'Issue #124',
            value: '#kjdjdkfsh'
          },

          {
            service: 'mex',
            type: 'mex',
            name: 'Archangelina',
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
        type: 'node'
      }
    ]
  }
]

export const defaultMexIntent = (id: string) => ({
  service: 'mex',
  type: 'node',
  name: 'Node',
  value: id
})
