import { defaultCommands } from '../Defaults/slashCommands';
import { useContentStore } from '../Editor/Store/ContentStore';
import useDataStore from '../Editor/Store/DataStore';
import { useEditorStore } from '../Editor/Store/EditorStore';
import { useSyncStore } from '../Editor/Store/SyncStore';
import { FileData } from '../Types/data';

export const useInitialize = () => {
  const initializeDataStore = useDataStore(state => state.initializeDataStore);
  const initContents = useContentStore(state => state.initContents);
  const loadNode = useEditorStore(state => state.loadNodeFromId);
  const initSyncBlocks = useSyncStore(state => state.initSyncBlocks);

  const init = (data: FileData) => {
    const { tags, ilinks, contents, syncBlocks } = data;
    initializeDataStore(tags, ilinks, defaultCommands);
    initContents(contents);
    // console.log('loading', contents);
    initSyncBlocks(syncBlocks);

    loadNode('@');
  };

  return init;
};
