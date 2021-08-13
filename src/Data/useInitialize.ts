import { defaultCommands } from '../Defaults/slashCommands';
import { useContentStore } from '../Editor/Store/ContentStore';
import useDataStore from '../Editor/Store/DataStore';
import { FileData } from '../Types/data';

export const useInitialize = () => {
  const initializeDataStore = useDataStore(state => state.initializeDataStore);
  const initContents = useContentStore(state => state.initContents);

  const init = (data: FileData) => {
    const { tags, ilinks, contents } = data;
    initializeDataStore(tags, ilinks, defaultCommands);
    initContents(contents);
  };

  return init;
};
