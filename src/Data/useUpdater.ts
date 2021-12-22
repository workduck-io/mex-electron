import { client } from '@workduck-io/dwindle'
import { uniq } from 'lodash'
import { SyncBlockTemplate, Service } from '../Editor/Components/SyncBlock'
import { defaultCommands } from '../Defaults/slashCommands'
import { extractSyncBlockCommands } from '../Editor/Components/SlashCommands/useSyncConfig'
import useDataStore from '../Editor/Store/DataStore'
import { generateComboTexts } from '../Editor/Store/sampleTags'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import { useAuthStore } from '../Hooks/useAuth/useAuth'
import { integrationURLs } from '../Requests/routes'
import { extractSnippetCommands } from '../Snippets/useSnippets'
import { useSaveData } from './useSaveData'
import useOnboard from '../Components/Onboarding/store'

export const useUpdater = () => {
  const setSlashCommands = useDataStore((state) => state.setSlashCommands)
  const setServices = useSyncStore((store) => store.setServices)
  const setTemplates = useSyncStore((store) => store.setTemplates)
  const isOnboarding = useOnboard((s) => s.isOnboarding)

  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)
  const saveData = useSaveData()

  const updater = () => {
    const snippetCommands = extractSnippetCommands(useSnippetStore.getState().snippets)
    const syncCommands = extractSyncBlockCommands(useSyncStore.getState().templates)

    const commands = generateComboTexts(uniq([...snippetCommands, ...syncCommands, ...defaultCommands]))

    setSlashCommands(Array.from(commands))
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
