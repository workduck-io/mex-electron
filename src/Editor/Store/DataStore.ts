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
  ilinks: ComboText[];
  initializeData: (tags: ComboText[], ids: ComboText[]) => void;
  addTag: (tag: string) => void;
  addILink: (ilink: string) => void;
}

const useDataStore = create<DataStoreState>((set, get) => ({
  tags: [],
  ilinks: [],
  initializeData: (tags, ilinks) => {
    set({
      tags,
      ilinks,
    });
  },
  addTag: (tag) => {
    set({
      tags: [...get().tags, generateTag(tag, get().tags.length)],
    });
  },
  addILink: (ilink) => {
    set({
      ilinks: [...get().ilinks, generateTag(ilink, get().ilinks.length)],
    });
  },
}));

export default useDataStore;
