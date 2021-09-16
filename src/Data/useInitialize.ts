import useThemeStore from '../Editor/Store/ThemeStore'
import { defaultCommands } from '../Defaults/slashCommands'
import { useContentStore } from '../Editor/Store/ContentStore'
import useDataStore from '../Editor/Store/DataStore'
import { useEditorStore } from '../Editor/Store/EditorStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import { FileData } from '../Types/data'
import { getTheme } from '../Styled/themes/defaultThemes'
import { extractSnippetCommands } from '../Snippets/useSnippets'
import { generateComboTexts } from '../Editor/Store/sampleTags'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { useSpotlightSettingsStore } from '../Spotlight/store/settings'
import { useNavigation } from '../Hooks/useNavigation/useNavigation'
import { extractSyncBlockCommands } from '../Editor/Components/SlashCommands/useSyncConfig'

export enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX',
}

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initContents = useContentStore((state) => state.initContents)
  const { push } = useNavigation()
  const initSpotlightSettings = useSpotlightSettingsStore((state) => state.initSpotlightSettings)
  const initSyncBlocks = useSyncStore((state) => state.initSyncBlocks)
  const setTheme = useThemeStore((state) => state.setTheme)
  const initSnippets = useSnippetStore((state) => state.initSnippets)
  const loadNodeFromId = useEditorStore((state) => state.loadNodeFromId)

  const update = (data: FileData) => {
    const { tags, ilinks, linkCache, contents, syncBlocks, snippets } = data
    const snippetCommands = extractSnippetCommands(snippets)
    const syncCommands = extractSyncBlockCommands()
    const slashCommands = generateComboTexts([...defaultCommands, ...syncCommands, ...snippetCommands])

    initializeDataStore(tags, ilinks, slashCommands, linkCache)
    initSpotlightSettings(data.userSettings.spotlight)
    initContents(contents)
    initSyncBlocks(syncBlocks)
    initSnippets(snippets)
    setTheme(getTheme(data.userSettings.theme))
  }

  const init = (data: FileData, initNodeId?: string, initFor?: AppType) => {
    update(data)
    const keyToLoad = initNodeId || '@'
    if (initFor === AppType.SPOTLIGHT) {
      loadNodeFromId(keyToLoad)
    } else {
      push(keyToLoad)
    }
  }

  return { init, update }
}
