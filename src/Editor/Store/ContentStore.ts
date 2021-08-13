import create from 'zustand';
import { NodeContent } from '../../Types/data';

interface Contents {
  [key: string]: NodeContent;
}

interface ContentStoreState {
  contents: Contents;
  getContent: (id: string) => void;
  setContent: (id: string, content: string) => void;
  initContents: (contents: Contents) => void;
}

export const useContentStore = create<ContentStoreState>((set, get) => ({
  contents: {},
  setContent: (id, content) => {
    set({
      contents: { ...get().contents, [id]: { type: 'string', content } },
    });
  },
  getContent: id => {
    return get().contents[id];
  },
  initContents: contents => {
    set({
      contents,
    });
  },
}));
