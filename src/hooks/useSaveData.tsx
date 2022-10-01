import { useUserPreferenceStore } from '@store/userPreferenceStore'
import { ipcRenderer } from 'electron'

import { IpcAction } from '../data/IpcAction'
import { useSpotlightSettingsStore } from '../store/settings.spotlight'
import { useVersionStore } from '../store/useAppDataStore'
import { useContentStore } from '../store/useContentStore'
import useDataStore from '../store/useDataStore'
import { useSnippetStore } from '../store/useSnippetStore'
import { useSyncStore } from '../store/useSyncStore'
import useTodoStore from '../store/useTodoStore'
import { FileData } from '../types/data'
import { mog } from '../utils/lib/helper'
import { useReminderStore } from './useReminders'
import { useViewStore } from './useTaskViews'

// Save the data in the local file database
export const useSaveData = () => {
  // const { updater } = useUpdater()
  const saveData = () => {
    const { baseNodeId, ilinks, linkCache, tags, tagsCache, archive, bookmarks, sharedNodes } = useDataStore.getState()
    const { syncBlocks, templates, intents, services } = useSyncStore.getState()
    const { reminders } = useReminderStore.getState()
    const { views } = useViewStore.getState()
    const { version } = useVersionStore.getState()

    const fileData: FileData = {
      version,
      remoteUpdate: false,
      baseNodeId,
      ilinks,
      linkCache,
      todos: useTodoStore.getState().todos,
      views,
      reminders,
      tags,
      tagsCache,
      archive,
      bookmarks,
      sharedNodes,
      contents: useContentStore.getState().contents,
      syncBlocks,
      templates,
      intents,
      services,

      snippets: useSnippetStore.getState().snippets,
      userSettings: {
        theme: useUserPreferenceStore.getState().theme,
        spotlight: {
          showSource: useSpotlightSettingsStore.getState().showSource
        }
      }
    }
    mog('We saved the data for you', { version, views, fileData })

    ipcRenderer.send(IpcAction.SET_LOCAL_DATA, fileData)
    // updater()
  }

  // useContentStore.subscribe(({ contents }) => {
  //   saveData(contents);
  // });

  // FIXME return an object
  return { saveData }
}
