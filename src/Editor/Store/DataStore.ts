import create from 'zustand';
import { generateTree } from '../../Components/Sidebar/sampleRCTreeData';
import { generateILink } from '../../Conf/sampleILinks';
import { generateTag } from '../../Conf/sampleTags';
import getFlatTree from '../../Lib/flatTree';

interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string;
  text: string;
  value: string;
}

interface DataStoreState {
  tags: ComboText[];
  ilinks: ComboText[];
  initializeData: (tags: ComboText[], ids: ComboText[]) => void;
  addTag: (tag: string) => void;
  addILink: (ilink: string) => void;
}

const useDataStore = create<DataStoreState>((set, get) => ({
  // Tags
  tags: [],

  // Internal links (node ids)
  ilinks: [],

  // Load initial data in the store
  initializeData: (tags, ilinks) => {
    set({
      tags,
      ilinks,
    });
  },

  // Add a new tag to the store
  addTag: (tag) => {
    set({
      tags: [...get().tags, generateTag(tag, get().tags.length)],
    });
  },

  // Add a new ILink to the store
  addILink: (ilink) => {
    set({
      ilinks: [...get().ilinks, generateILink(ilink, get().ilinks.length)],
    });
  },
}));

export const useTreeFromLinks = () => {
  const ilinks = useDataStore((store) => store.ilinks);
  const links = ilinks.map((i) => i.text);
  const tree = generateTree(links);

  return tree;
};

export const useFlatTreeFromILinks = () => {
  return getFlatTree(useTreeFromLinks());
};

export default useDataStore;
