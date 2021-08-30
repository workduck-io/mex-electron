import { ipcRenderer } from 'electron'
import useThemeStore from '../Editor/Store/ThemeStore'
import { useContentStore } from '../Editor/Store/ContentStore'
import useDataStore from '../Editor/Store/DataStore'
import { useSyncStore } from '../Editor/Store/SyncStore'

interface UserSettings {
  // Key of theme id in ThemeStore
  theme: string
}

// Save the data in the local file database
export const useSaveData = () => {
  const saveData = () => {
    // console.log('We saved the data for you');

    ipcRenderer.send('set-local-data', {
      ilinks: useDataStore.getState().ilinks,
      tags: useDataStore.getState().tags,
      contents: useContentStore.getState().contents,
      syncBlocks: useSyncStore.getState().syncBlocks,
      userSettings: {
        theme: useThemeStore.getState().theme.id
      }
    })
  }

  // useContentStore.subscribe(({ contents }) => {
  //   saveData(contents);
  // });

  return saveData
}
