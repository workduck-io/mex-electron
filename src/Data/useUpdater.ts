import axios from 'axios'
import { uniq } from 'lodash'
import { WORKSPACE_ID } from '../Defaults/auth'
import { defaultCommands } from '../Defaults/slashCommands'
import { extractSyncBlockCommands } from '../Editor/Components/SlashCommands/useSyncConfig'
import useDataStore from '../Editor/Store/DataStore'
import { generateComboTexts } from '../Editor/Store/sampleTags'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import { apiURLs } from '../Requests/routes'
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

  const updateServices = () => {
    axios
      .get(apiURLs.getWorkspaceAuth(WORKSPACE_ID))
      .then((d) => {
        const services = useSyncStore.getState().services
        const sData = d.data
        const newServices = services.map((s) => {
          const connected = sData.some((cs) => s.id === cs.type)

          return { ...s, connected }
        })
        setServices(newServices)
      })
      .catch((e) => console.error(e))
  }

  return { updater, updateServices }
}
