import create from 'zustand';
import { generateTag } from '../../Conf/sampleTags';

interface ComboText {
  // This interface is used to store tags in a combobox friendly way.
  key: string;
  text: string;
  value: string;
}

interface DataStoreState {
  tags: ComboText[];
  ids: string[];
  initializeData: (tags: ComboText[], ids: string[]) => void;
  addTag: (tag: string) => void;
}

const useDataStore = create<DataStoreState>((set, get) => ({
  tags: [],
  ids: [],
  initializeData: (tags, ids) => {
    set({
      tags,
      ids,
    });
  },
  addTag: (tag) => {
    set({
      tags: [...get().tags, generateTag(tag, get().tags.length)],
    });
  },
}));

export default useDataStore;
