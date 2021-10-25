import { ipcRenderer } from 'electron'
import { useContentStore } from '../Editor/Store/ContentStore'
import useDataStore from '../Editor/Store/DataStore'
import { useSnippetStore } from '../Editor/Store/SnippetStore'
import { useSyncStore } from '../Editor/Store/SyncStore'
import useThemeStore from '../Editor/Store/ThemeStore'
import { useSpotlightSettingsStore } from '../Spotlight/store/settings'
import { IpcAction } from '../Spotlight/utils/constants'
import { FileData } from '../Types/data'

// Save the data in the local file database
export const useSaveData = () => {
  // const { updater } = useUpdater()
  const saveData = () => {
    // console.log('We saved the data for you')
    // console.log(JSON.stringify(useContentStore.getState().contents, null, 2))
    const fileData: FileData = {
      remoteUpdate: false,
      ilinks: useDataStore.getState().ilinks,
      linkCache: useDataStore.getState().linkCache,
      tags: useDataStore.getState().tags,
      contents: useContentStore.getState().contents,

      syncBlocks: useSyncStore.getState().syncBlocks,
      templates: useSyncStore.getState().templates,
      intents: useSyncStore.getState().intents,
      services: useSyncStore.getState().services,

      snippets: useSnippetStore.getState().snippets,
      userSettings: {
        theme: useThemeStore.getState().theme.id,
        spotlight: {
          showSource: useSpotlightSettingsStore.getState().showSource
        }
      }
    }

    ipcRenderer.send(IpcAction.SET_LOCAL_DATA, fileData)
    // updater()
  }

  // useContentStore.subscribe(({ contents }) => {
  //   saveData(contents);
  // });

  return saveData
}
