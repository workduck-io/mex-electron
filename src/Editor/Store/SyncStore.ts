import create from 'zustand';
import { SyncBlockData, SyncContextType } from '../Components/SyncBlock/SyncBlock.types';

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncBlocks: [],
  addSyncBlock: (block: SyncBlockData) => {
    set(() => ({
      syncBlocks: [...get().syncBlocks, block],
    }));
  },
}));
