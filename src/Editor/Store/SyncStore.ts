import create from 'zustand';
import { SyncContextType } from '../Components/SyncBlock/SyncBlock.types';

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncBlocks: [],
  addSyncBlock: block => {
    set(() => ({
      syncBlocks: [...get().syncBlocks, block],
    }));
  },
  editSyncBlock: block => {
    let oldBlocks = get().syncBlocks;
    oldBlocks = oldBlocks.filter(s => s.id !== block.id);

    set({ syncBlocks: [block, ...oldBlocks] });
  },
  initSyncBlocks: syncBlocks => {
    set(() => ({
      syncBlocks,
    }));
  },
}));
