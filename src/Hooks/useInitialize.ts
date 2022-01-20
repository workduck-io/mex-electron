import { getTheme } from '../style/themes/defaultThemes'
import { useSpotlightSettingsStore } from '../store/settings.spotlight'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { useSnippetStore } from '../store/useSnippetStore'
import { useSyncStore } from '../store/useSyncStore'
import useThemeStore from '../store/useThemeStore'
import { FileData } from '../types/data'
import { createNodeWithUid } from '../utils/lib/helper'
import useLoad from './useLoad'
import { useSlashCommands } from './useSlashCommands'

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
