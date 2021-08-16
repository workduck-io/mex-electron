import create from 'zustand';
import { SyncContextType } from '../Components/SyncBlock/SyncBlock.types';

export const useSyncStore = create<SyncContextType>((set, get) => ({
  syncId: 'initial',
  syncBlocks: [],
  addSyncBlock: block => {
    set(() => ({
      syncBlocks: [...get().syncBlocks, block],
      syncId: String(Date.now()),
    }));
  },
  editSyncBlock: block => {
    let oldBlocks = get().syncBlocks;
    oldBlocks = oldBlocks.filter(s => s.id !== block.id);

    set({
      syncBlocks: [block, ...oldBlocks],
      syncId: String(Date.now()),
    });
  },
  initSyncBlocks: syncBlocks => {
    set(() => ({
      syncBlocks,
      syncId: String(Date.now()),
    }));
  },
}));
