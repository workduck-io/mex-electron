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

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initContents = useContentStore((state) => state.initContents)
  const loadNode = useEditorStore((state) => state.loadNodeFromId)
  const initSyncBlocks = useSyncStore((state) => state.initSyncBlocks)
  const setTheme = useThemeStore((state) => state.setTheme)
  const initSnippets = useSnippetStore((state) => state.initSnippets)

  const update = (data: FileData) => {
    const { tags, ilinks, linkCache, contents, syncBlocks, snippets } = data
    const snippetCommands = extractSnippetCommands(snippets)
    const slashCommands = generateComboTexts([...defaultCommands, ...snippetCommands])

    initializeDataStore(tags, ilinks, slashCommands, linkCache)
    initContents(contents)
    initSyncBlocks(syncBlocks)
    initSnippets(snippets)
    setTheme(getTheme(data.userSettings.theme))
  }

  const init = (data: FileData, initNodeId?: string) => {
    update(data)
    loadNode(initNodeId || '@')
  }

  return { init, update }
}
