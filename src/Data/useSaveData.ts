import { ipcRenderer } from 'electron';
import { useContentStore } from '../Editor/Store/ContentStore';
import { FileData } from '../Types/data';

// Save the data in the local file database
export const useSaveData = () => {
  const contents = useContentStore(state => state.contents);

  const data: FileData = {
    ilinks: [],
    tags: [],
    contents,
  };

  const saveData = () => ipcRenderer.send('set-local-data', data);

  return saveData;
};
