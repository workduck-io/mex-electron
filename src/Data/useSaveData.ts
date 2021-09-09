import { ipcRenderer } from 'electron'
import useThemeStore from '../Editor/Store/ThemeStore'
import { useContentStore } from '../Editor/Store/ContentStore'
import useDataStore from '../Editor/Store/DataStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { useUpdater } from './useUpdater'
import { useSpotlightSettingsStore } from '../Spotlight/store/settings'
import { useEditorStore } from '../Editor/Store/EditorStore'

interface UserSettings {
  // Key of theme id in ThemeStore
  theme: string
}

// Save the data in the local file database
export const useSaveData = () => {
  const { updater } = useUpdater()
  const saveData = () => {
    // console.log('We saved the data for you');
    // console.log(JSON.stringify(useContentStore.getState().contents, null, 2))

    ipcRenderer.send('set-local-data', {
      ilinks: useDataStore.getState().ilinks,
      linkCache: useDataStore.getState().linkCache,
      tags: useDataStore.getState().tags,
      contents: useContentStore.getState().contents,
      syncBlocks: useSyncStore.getState().syncBlocks,
      snippets: useSnippetStore.getState().snippets,
      userSettings: {
        theme: useThemeStore.getState().theme.id,
        spotlight: {
          showSource: useSpotlightSettingsStore.getState().showSource
        }
      }
    })

    updater()
  }

  // useContentStore.subscribe(({ contents }) => {
  //   saveData(contents);
  // });

  return saveData
}
