import { createNodeWithUid } from '../Lib/helper'
import { defaultCommands } from '../Defaults/slashCommands'
import { extractSyncBlockCommands } from '../editor/Components/SlashCommands/useSyncConfig'
import { useContentStore } from '../editor/Store/useContentStore'
import useDataStore from '../editor/Store/useDataStore'
import { generateComboTexts } from '../editor/Store/generateComboItem'
import { useSnippetStore } from '../editor/Store/useSnippetStore'
import { useSyncStore } from '../editor/Store/useSyncStore'
import useThemeStore from '../editor/Store/useThemeStore'
import useLoad from '../Hooks/useLoad/useLoad'
import { extractSnippetCommands } from '../Snippets/useSnippets'
import { useSpotlightSettingsStore } from '../Spotlight/store/settings'
import { getTheme } from '../style/themes/defaultThemes'
import { FileData } from '../Types/data'
import { useSlashCommands } from '../Hooks/useSlashCommands'

export enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX'
}

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initContents = useContentStore((state) => state.initContents)
  const initSpotlightSettings = useSpotlightSettingsStore((state) => state.initSpotlightSettings)
  const initSyncBlocks = useSyncStore((state) => state.initSyncBlocks)
  const setTheme = useThemeStore((state) => state.setTheme)
  const initSnippets = useSnippetStore((state) => state.initSnippets)
  const { generateSlashCommands } = useSlashCommands()
  const { loadNodeProps } = useLoad()

  const update = (data: FileData) => {
    const {
      tags,
      ilinks,
      linkCache,
      tagsCache,
      bookmarks,
      contents,
      archive,
      syncBlocks,
      snippets,
      templates,
      services,
      intents,
      baseNodeId
    } = data
    // const snippetCommands = extractSnippetCommands(snippets)
    // const syncCommands = extractSyncBlockCommands(templates)
    const slashCommands = generateSlashCommands(snippets, templates)

    const initData = {
      tags,
      tagsCache,
      ilinks,
      slashCommands,
      linkCache,
      archive: archive ?? [],
      baseNodeId,
      bookmarks
    }

    initializeDataStore(initData)
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
      loadNodeProps(createNodeWithUid(keyToLoad))
    }
  }

  return { init, update }
}
