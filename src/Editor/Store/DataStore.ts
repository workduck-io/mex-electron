import create from 'zustand';
import { generateTree } from '../../Components/Sidebar/sampleRCTreeData';
import { generateComboText } from './sampleTags';
import getFlatTree from '../../Lib/flatTree';
import { DataStoreState } from './Types';

const useDataStore = create<DataStoreState>((set, get) => ({
  // Tags
  tags: [],

  // Internal links (node ids)
  ilinks: [],

  // Slash commands
  slash_commands: [],

  // Load initial data in the store
  initializeDataStore: (tags, ilinks, slash_commands) => {
    set({
      tags,
      ilinks,
      slash_commands,
    });
  },

  // Add a new tag to the store
  addTag: tag => {
    set({
      tags: [...get().tags, generateComboText(tag, get().tags.length)],
    });
  },

  // Add a new ILink to the store
  addILink: ilink => {
    set({
      ilinks: [...get().ilinks, generateComboText(ilink, get().ilinks.length)],
    });
  },

  setIlinks: ilinks => {
    set({
      ilinks,
    });
  },
}));

export const useTreeFromLinks = () => {
  const ilinks = useDataStore(store => store.ilinks);
  const links = ilinks.map(i => i.raw_id);
  const tree = generateTree(links);

  return tree;
};

export const useFlatTreeFromILinks = () => {
  return getFlatTree(useTreeFromLinks());
};

export default useDataStore;
