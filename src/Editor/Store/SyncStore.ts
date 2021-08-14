import create from 'zustand';
import { SyncBlockData, SyncContextType } from '../Components/SyncBlock/SyncBlock.types';

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncBlocks: [],
  addSyncBlock: (block: SyncBlockData) => {
    set(() => ({
      syncBlocks: [...get().syncBlocks, block],
    }));
  },
  editSyncBlock: (block: SyncBlockData) => {
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
