import useThemeStore from '../Editor/Store/ThemeStore'
import { defaultCommands } from '../Defaults/slashCommands'
import { useContentStore } from '../Editor/Store/ContentStore'
import useDataStore from '../Editor/Store/DataStore'
import { useEditorStore } from '../Editor/Store/EditorStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import { FileData } from '../Types/data'
import { getTheme } from '../Styled/themes/defaultThemes'
import { extractSnippetIdsFromContent } from '../Snippets/useSnippets'
import { generateComboTexts } from '../Editor/Store/sampleTags'

export const useInitialize = () => {
  const initializeDataStore = useDataStore((state) => state.initializeDataStore)
  const initContents = useContentStore((state) => state.initContents)
  const loadNode = useEditorStore((state) => state.loadNodeFromId)
  const initSyncBlocks = useSyncStore((state) => state.initSyncBlocks)
  const setTheme = useThemeStore((state) => state.setTheme)

  const update = (data: FileData) => {
    const { tags, ilinks, contents, syncBlocks } = data
    const snippets = extractSnippetIdsFromContent(contents)
    const slashCommands = generateComboTexts([...defaultCommands, ...snippets])

    initializeDataStore(tags, ilinks, slashCommands)
    initContents(contents)
    initSyncBlocks(syncBlocks)
    setTheme(getTheme(data.userSettings.theme))
  }

  const init = (data: FileData) => {
    update(data)
    loadNode('@')
  }

  return { init, update }
}
