import { ipcRenderer } from 'electron'
import { IpcAction } from '../data/IpcAction'
import { useSpotlightSettingsStore } from '../store/settings.spotlight'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { useSnippetStore } from '../store/useSnippetStore'
import { useSyncStore } from '../store/useSyncStore'
import useThemeStore from '../store/useThemeStore'
import { FileData } from '../types/data'

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

  // FIXME return an object
  return saveData
}
