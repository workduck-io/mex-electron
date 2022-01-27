// import { useSyncStore } from '../../Editor/Store/useSyncStore'

import useDataStore from '../../../store/useDataStore'
import { useSyncStore } from '../../../store/useSyncStore'

export const useOnboardingData = () => {
  const templates = useSyncStore((store) => store.templates)
  const services = useSyncStore((store) => store.services)
  const ilinks = useDataStore((s) => s.ilinks)

  const addILink = useDataStore((store) => store.addILink)
  const addTag = useDataStore((store) => store.addTag)

  const setServices = useSyncStore((store) => store.setServices)
  const setTemplates = useSyncStore((store) => store.setTemplates)

  const onBoardServices = [
    {
      id: 'ONBOARD',
      name: 'ONBOARD',
      type: 'medium',
      imageUrl: 'https://workduck.io',
      description: 'Onboard users',
      authUrl: '',
      connected: true,
      enabled: true
    }
  ]

  const onBoardTempaltes = [
    {
      id: 'SYNCTEMP_ONBOARD',
      title: 'Flow Block Tour',
      command: 'onboard',
      description: 'This gives you a quick way to connect with mex demo',
      intents: [
        {
          service: 'ONBOARD',
          type: 'medium'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    },
    {
      id: 'SYNCTEMP_ISSUETRACKING',
      title: 'Issue Tracking',
      command: 'issuetracking',
      description: 'Track Issues',
      intents: [
        {
          service: 'GITHUB',
          type: 'issue'
        },
        {
          service: 'SLACK',
          type: 'channel'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    },
    {
      id: 'SYNCTEMP_TASK',
      title: 'Slack Task management',
      command: 'task',
      description: 'Manage tasks',
      intents: [
        {
          service: 'SLACK',
          type: 'channel'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    },
    {
      id: 'SYNCTEMP_DEVTASK',
      title: 'Github tasks',
      command: 'devtask',
      description: 'Create tasks using github issues',
      intents: [
        {
          service: 'GITHUB',
          type: 'issue'
        },
        {
          service: 'MEX',
          type: 'node'
        }
      ]
    }
  ]

  // * Integration dummy data
  const setOnboardData = () => {
    setServices(onBoardServices)
    setTemplates(onBoardTempaltes)
    addTag('onboard')
    addILink('Product Tour')
  }

  const removeOnboardData = () => {
    const remainingTemplates = onBoardTempaltes.filter((item) => !templates.includes(item))
    const remainingServices = onBoardServices.filter((item) => !services.includes(item))

    setTemplates(remainingTemplates)
    setServices(remainingServices)
  }

  return { setOnboardData, removeOnboardData }
}
