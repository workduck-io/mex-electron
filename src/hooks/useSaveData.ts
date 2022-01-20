import { ipcRenderer } from 'electron'
import { useContentStore } from '../editor/Store/useContentStore'
import useDataStore from '../editor/Store/useDataStore'
import { useSnippetStore } from '../editor/Store/useSnippetStore'
import { useSyncStore } from '../editor/Store/useSyncStore'
import useThemeStore from '../editor/Store/useThemeStore'
import { useSpotlightSettingsStore } from '../Spotlight/store/settings'
import { IpcAction } from '../Spotlight/utils/constants'
import { FileData } from '../Types/data'

// Save the data in the local file database
export const useSaveData = () => {
  // const { updater } = useUpdater()
  const saveData = () => {
    // console.log('We saved the data for you')
    const { baseNodeId, ilinks, linkCache, tags, tagsCache, archive, bookmarks } = useDataStore.getState()
    const { syncBlocks, templates, intents, services } = useSyncStore.getState()

    const fileData: FileData = {
      remoteUpdate: false,
      baseNodeId,
      ilinks,
      linkCache,
      tags,
      tagsCache,
      archive,
      bookmarks,
      contents: useContentStore.getState().contents,

      syncBlocks,
      templates,
      intents,
      services,

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
