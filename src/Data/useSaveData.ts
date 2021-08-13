import { ipcRenderer } from 'electron';
import { useContentStore } from '../Editor/Store/ContentStore';
import useDataStore from '../Editor/Store/DataStore';
import { FileData } from '../Types/data';

// Save the data in the local file database
export const useSaveData = () => {
  const contents = useContentStore(state => state.contents);
  const ilinks = useDataStore(state => state.ilinks);
  const tags = useDataStore(state => state.tags);

  const data: FileData = {
    ilinks,
    tags,
    contents,
  };

  const saveData = () => ipcRenderer.send('set-local-data', data);

  return saveData;
};
