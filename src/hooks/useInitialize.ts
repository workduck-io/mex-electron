import { AppType } from '../data/constants'
import { useReminderStore } from '../hooks/useReminders'
import { useSpotlightSettingsStore } from '../store/settings.spotlight'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { useSnippetStore } from '../store/useSnippetStore'
import useTodoStore from '../store/useTodoStore'
import { FileData } from '../types/data'
import { createNodeWithUid } from '../utils/lib/helper'
import useLoad from './useLoad'
import { useNamespaces } from './useNamespaces'
import { useSlashCommands } from './useSlashCommands'
import { useViewStore } from './useTaskViews'

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initTodos = useTodoStore((store) => store.initTodos)
  const initContents = useContentStore((state) => state.initContents)
  const initSpotlightSettings = useSpotlightSettingsStore((state) => state.initSpotlightSettings)
  const setReminders = useReminderStore((state) => state.setReminders)
  const setViews = useViewStore((state) => state.setViews)
  const initSnippets = useSnippetStore((state) => state.initSnippets)
  const { generateSlashCommands } = useSlashCommands()
  const { loadNodeProps } = useLoad()
  const { getDefaultNamespaceId } = useNamespaces()

  const update = (data: FileData) => {
    const {
      tags,
      todos,
      reminders,
      ilinks,
      linkCache,
      tagsCache,
      bookmarks,
      sharedNodes,
      contents,
      archive,
      snippets,
      views,
      baseNodeId
    } = data
    // const snippetCommands = extractSnippetCommands(snippets)
    // const syncCommands = extractSyncBlockCommands(templates)
    const slashCommands = generateSlashCommands(snippets)

    const initData = {
      tags,
      tagsCache,
      ilinks,
      slashCommands,
      linkCache,
      archive: archive ?? [],
      baseNodeId,
      sharedNodes,
      bookmarks
    }

    initializeDataStore(initData)
    initSpotlightSettings(data.userSettings.spotlight)
    initContents(contents)
    initSnippets(snippets)
    initTodos(todos)
    setViews(views)
    setReminders(reminders)
    // const currentTheme = getTheme(data.userSettings.theme)
    // setTheme(currentTheme.id)
  }

  const init = (data: FileData, initNodeId?: string, initFor?: AppType) => {
    // mog('INIT data', { data })
    update(data)
    const keyToLoad = initNodeId || '@'
    const defaultNamespaceId = getDefaultNamespaceId()

    if (initFor === AppType.SPOTLIGHT) {
      loadNodeProps(createNodeWithUid(keyToLoad, defaultNamespaceId))
    }
  }

  return { init, update }
}
