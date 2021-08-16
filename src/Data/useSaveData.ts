import { ipcRenderer } from 'electron';
import { Contents } from '../Editor/Store/ContentStore';
import useDataStore from '../Editor/Store/DataStore';
import { useSyncStore } from '../Editor/Store/SyncStore';

// Save the data in the local file database
export const useSaveData = () => {
  const saveData = (contents: Contents) => {
    // console.log('We saved the data for you');

    ipcRenderer.send('set-local-data', {
      ilinks: useDataStore.getState().ilinks,
      tags: useDataStore.getState().tags,
      contents,
      syncBlocks: useSyncStore.getState().syncBlocks,
    });
  };

  // useContentStore.subscribe(({ contents }) => {
  //   saveData(contents);
  // });

  return saveData;
};
