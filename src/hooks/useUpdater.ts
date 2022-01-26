import { client } from '@workduck-io/dwindle'
import { integrationURLs } from '../apis/routes'
import useDataStore from '../store/useDataStore'
import useOnboard from '../store/useOnboarding'
import { useSnippetStore } from '../store/useSnippetStore'
import { useSyncStore } from '../store/useSyncStore'
import { Service, SyncBlockTemplate } from '../editor/Components/SyncBlock'
import { useSaveData } from './useSaveData'
import { useSlashCommands } from './useSlashCommands'
import { useAuthStore } from '../services/auth/useAuth'

export const useUpdater = () => {
  const setSlashCommands = useDataStore((state) => state.setSlashCommands)
  const setServices = useSyncStore((store) => store.setServices)
  const setTemplates = useSyncStore((store) => store.setTemplates)
  const { generateSlashCommands } = useSlashCommands()
  const isOnboarding = useOnboard((s) => s.isOnboarding)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const { saveData } = useSaveData()

  const updater = () => {
    const slashCommands = generateSlashCommands(useSnippetStore.getState().snippets, useSyncStore.getState().templates)
    setSlashCommands(slashCommands)
  }

  const updateDefaultServices = async () => {
    if (useAuthStore.getState().authenticated && !isOnboarding) {
      await client
        .get(integrationURLs.getAllServiceData(getWorkspaceId()))
        .then((d) => {
          const data = d.data
          // console.log({ data })
          const services: Service[] = data.map((s) => ({
            id: s.serviceType,
            name: s.name,
            type: s.intentTypes[0],
            imageUrl: s.imageUrl,
            description: s.description,
            authUrl: s.authUrl,
            connected: false,
            enabled: s.enabled
          }))

          setServices(services)
        })
        .then(() => saveData())
    } else console.error('Not authenticated, not fetching default services')
  }

  const updateServices = async () => {
    if (useAuthStore.getState().authenticated && !isOnboarding) {
      await client
        .get(integrationURLs.getWorkspaceAuth(getWorkspaceId()))
        .then((d) => {
          const services = useSyncStore.getState().services
          const sData = d.data
          const newServices = services.map((s) => {
            if (s.id === 'ONBOARD') return s
            const connected = sData.some((cs) => s.id === cs.type)
            return { ...s, connected }
          })

          setServices(newServices)
        })
        .then(() => saveData())
        .catch(console.error)
    } else console.error('Not authenticated, not fetching workspace services')
  }

  const getTemplates = async () => {
    if (useAuthStore.getState().authenticated) {
      await client
        .get(integrationURLs.getAllTemplates(getWorkspaceId()))
        .then((d) => {
          const data = d.data

          const templates: SyncBlockTemplate[] = data.map((s) => ({
            id: s.templateId,
            title: s.title,
            command: s.command,
            description: s.description,
            intents: Object.keys(s.intentMap).map((key) => ({
              service: key,
              type: s.intentMap[key]
            }))
          }))

          setTemplates(templates)
        })
        .then(() => saveData())
    } else console.error('Not authenticated, not fetching default services')
  }

  return { updater, updateServices, getTemplates, updateDefaultServices }
}
