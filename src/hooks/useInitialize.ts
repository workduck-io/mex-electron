import { FileData } from '../types/data'
import { IpcAction } from '../data/IpcAction'
import { appNotifierWindow } from '../electron/utils/notifiers'
import { createNodeWithUid } from '../utils/lib/helper'
import { getTheme } from '../style/themes/defaultThemes'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import useLoad from './useLoad'
import { useSlashCommands } from './useSlashCommands'
import { useSnippetStore } from '../store/useSnippetStore'
import { useSpotlightSettingsStore } from '../store/settings.spotlight'
import { useSyncStore } from '../store/useSyncStore'
import useThemeStore from '../store/useThemeStore'
import useTodoStore from '../store/useTodoStore'
import { useReminderStore } from './useReminders'

export enum AppType {
  SPOTLIGHT = 'SPOTLIGHT',
  MEX = 'MEX'
}

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initTodos = useTodoStore((store) => store.initTodos)
  const initContents = useContentStore((state) => state.initContents)
  const initSpotlightSettings = useSpotlightSettingsStore((state) => state.initSpotlightSettings)
  const initSyncBlocks = useSyncStore((state) => state.initSyncBlocks)
  const setReminders = useReminderStore((state) => state.setReminders)
  const setTheme = useThemeStore((state) => state.setTheme)
  const initSnippets = useSnippetStore((state) => state.initSnippets)
  const { generateSlashCommands } = useSlashCommands()
  const { loadNodeProps } = useLoad()

  const update = (data: FileData) => {
    const {
      tags,
      todos,
      reminders,
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
    initTodos(todos)
    setReminders(reminders)
    const currentTheme = getTheme(data.userSettings.theme)
    appNotifierWindow(IpcAction.SET_THEME, AppType.MEX, { theme: currentTheme })
    setTheme(currentTheme)
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
