import { IntentTemplate } from '../../editor/Components/SyncBlock'

export const DefaultSyncBlockTemplates: {
  [id: string]: {
    title: string
    intentTemplates: IntentTemplate[]
  }
} = {
  issue: {
    title: 'Issue',
    intentTemplates: [
      {
        service: 'github',
        type: 'repo'
      },
      {
        service: 'slack',
        type: 'channel'
      },
      {
        service: 'mex',
        type: 'node'
      }
    ]
  },
  com: {
    title: 'Communication',
    intentTemplates: [
      {
        service: 'telegram',
        type: 'group'
      },
      {
        service: 'slack',
        type: 'channel'
      },
      {
        service: 'mex',
        type: 'node'
      }
    ]
  },
  slack: {
    title: 'Slack',
    intentTemplates: [
      {
        service: 'github',
        type: 'repo'
      },
      {
        service: 'slack',
        type: 'channel'
      },
      {
        service: 'mex',
        type: 'node'
      }
    ]
  }
}
