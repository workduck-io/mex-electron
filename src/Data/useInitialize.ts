import { defaultCommands } from '../Defaults/slashCommands'
import { extractSyncBlockCommands } from '../Editor/Components/SlashCommands/useSyncConfig'
import { useContentStore } from '../Editor/Store/ContentStore'
import useDataStore from '../Editor/Store/DataStore'
import { generateComboTexts } from '../Editor/Store/sampleTags'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import useThemeStore from '../Editor/Store/ThemeStore'
import useLoad from '../Hooks/useLoad/useLoad'
import { extractSnippetCommands } from '../Snippets/useSnippets'
import { useSpotlightSettingsStore } from '../Spotlight/store/settings'
import { getTheme } from '../Styled/themes/defaultThemes'
import { FileData } from '../Types/data'

export enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX',
}

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initContents = useContentStore((state) => state.initContents)
  const initSpotlightSettings = useSpotlightSettingsStore((state) => state.initSpotlightSettings)
  const initSyncBlocks = useSyncStore((state) => state.initSyncBlocks)
  const setTheme = useThemeStore((state) => state.setTheme)
  const initSnippets = useSnippetStore((state) => state.initSnippets)
  const { loadNode } = useLoad()

  const update = (data: FileData) => {
    const { tags, ilinks, linkCache, contents, syncBlocks, snippets, templates, services, intents } = data
    const snippetCommands = extractSnippetCommands(snippets)
    const syncCommands = extractSyncBlockCommands(templates)
    const slashCommands = generateComboTexts([...defaultCommands, ...syncCommands, ...snippetCommands])

    initializeDataStore(tags, ilinks, slashCommands, linkCache)
    initSpotlightSettings(data.userSettings.spotlight)
    initContents(contents)
    initSyncBlocks(syncBlocks, templates, services, intents)
    initSnippets(snippets)
    setTheme(getTheme(data.userSettings.theme))
  }

  const init = (data: FileData, initNodeId?: string, initFor?: AppType) => {
    update(data)
    const keyToLoad = initNodeId || '@'

    if (initFor === AppType.SPOTLIGHT) {
      loadNode(keyToLoad)
    }
  }

  return { init, update }
}
