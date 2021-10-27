import axios from 'axios'
import { uniq } from 'lodash'
import { WORKSPACE_ID } from '../Defaults/auth'
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

  const updater = () => {
    const snippetCommands = extractSnippetCommands(useSnippetStore.getState().snippets)
    const syncCommands = extractSyncBlockCommands(useSyncStore.getState().templates)

    const commands = generateComboTexts(uniq([...snippetCommands, ...syncCommands, ...defaultCommands]))

    // console.log('Generated', { commands })
    setSlashCommands(Array.from(commands))
  }

  const updateDefaultServices = async () => {
    await axios.get(integrationURLs.getAllServiceData(WORKSPACE_ID)).then((d) => {
      const data = d.data
      const services: Service[] = data.map((s) => ({
        id: s.serviceType,
        name: s.name,
        type: s.intentTypes[0],
        imageUrl: s.imageUrl,
        description: s.description,
        authUrl: s.authUrl,
        connected: false
      }))
      // console.log({ services })
      setServices(services)
    })
  }

  const updateServices = async () => {
    await axios
      .get(integrationURLs.getWorkspaceAuth(WORKSPACE_ID))
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
  }

  return { updater, updateServices, updateDefaultServices }
}
