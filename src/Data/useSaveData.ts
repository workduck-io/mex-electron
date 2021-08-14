import { ipcRenderer } from 'electron';
import { Contents, useContentStore } from '../Editor/Store/ContentStore';
import useDataStore from '../Editor/Store/DataStore';
import { useSyncStore } from '../Editor/Store/SyncStore';

// Save the data in the local file database
export const useSaveData = () => {
  // const contents = useContentStore(state => state.contents);
  const ilinks = useDataStore(state => state.ilinks);
  const tags = useDataStore(state => state.tags);
  const syncBlocks = useSyncStore(state => state.syncBlocks);

  const saveData = (contents: Contents) => {
    // console.log('Contents being saved', contents);

    ipcRenderer.send('set-local-data', {
      ilinks,
      tags,
      contents,
      syncBlocks,
    });
  };

  useContentStore.subscribe(({ contents }) => {
    saveData(contents);
  });

  return saveData;
};
