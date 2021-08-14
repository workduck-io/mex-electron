import create from 'zustand';
import { generateTree, SEPARATOR } from '../../Components/Sidebar/sampleRCTreeData';
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

export const getLevel = (id: string) => id.split(SEPARATOR).length;

/** Link sanatization
 *
 * Orders the links according to their level in tree
 * Guarantees parent is before child -> Condition required for correct tree
 */
export const sanatizeLinks = (links: string[]): string[] => {
  let oldLinks = links;
  const newLinks: string[] = [];
  let currentDepth = 1;

  while (oldLinks.length > 0) {
    for (const l of links) {
      if (getLevel(l) === currentDepth) {
        newLinks.push(l);
        oldLinks = oldLinks.filter(k => k !== l);
      }
    }
    currentDepth += 1;
  }

  return newLinks;
};

export const useTreeFromLinks = () => {
  const ilinks = useDataStore(store => store.ilinks);
  const links = ilinks.map(i => i.text);
  const sanatizedLinks = sanatizeLinks(links);
  const tree = generateTree(sanatizedLinks);

  return tree;
};

export const useFlatTreeFromILinks = () => {
  return getFlatTree(useTreeFromLinks());
};

export default useDataStore;
