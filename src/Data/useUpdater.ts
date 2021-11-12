import { client } from '@workduck-io/dwindle'
import { uniq } from 'lodash'
import { useAuthStore } from '../Hooks/useAuth/useAuth'
import { defaultCommands } from '../Defaults/slashCommands'
import { extractSyncBlockCommands } from '../Editor/Components/SlashCommands/useSyncConfig'
import { Service } from '../Editor/Components/SyncBlock'
import useDataStore from '../Editor/Store/DataStore'
import { generateComboTexts } from '../Editor/Store/sampleTags'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import { integrationURLs } from '../Requests/routes'
import { extractSnippetCommands } from '../Snippets/useSnippets'

export const useUpdater = () => {
  const setSlashCommands = useDataStore((state) => state.setSlashCommands)
  const setServices = useSyncStore((store) => store.setServices)
  const getWorkspaceId = useAuthStore((store) => store.getWorkspaceId)

  const updater = () => {
    const snippetCommands = extractSnippetCommands(useSnippetStore.getState().snippets)
    const syncCommands = extractSyncBlockCommands(useSyncStore.getState().templates)

    const commands = generateComboTexts(uniq([...snippetCommands, ...syncCommands, ...defaultCommands]))

    setSlashCommands(Array.from(commands))
  }

  const updateDefaultServices = async () => {
    if (useAuthStore.getState().authenticated) {
      await client.get(integrationURLs.getAllServiceData(getWorkspaceId())).then((d) => {
        const data = d.data
        console.log({ data })
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
        // console.log({ services })
        setServices(services)
      })
    } else console.error('Not authenticated, not fetching default services')
  }

  const updateServices = async () => {
    if (useAuthStore.getState().authenticated) {
      await client
        .get(integrationURLs.getWorkspaceAuth(getWorkspaceId()))
        .then((d) => {
          const services = useSyncStore.getState().services
          const sData = d.data
          const newServices = services.map((s) => {
            const connected = sData.some((cs) => s.id === cs.type)
            return { ...s, connected }
          })
          // console.log({ newServices })

          setServices(newServices)
        })
        .catch(console.error)
    } else console.error('Not authenticated, not fetching workspace services')
  }

  return { updater, updateServices, updateDefaultServices }
}
