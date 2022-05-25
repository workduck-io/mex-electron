import { mog } from '@utils/lib/helper'
import create from 'zustand'
import { useActionStore } from './useActionStore'

type ActionsCacheType = {
  resultCache: Record<string, any>
  getCacheResult: (actionId: string) => any
  setResultCache: (resultCache: Record<string, any>) => void
  addResultInCache: (actionId: string, result: any) => void
}

export const useActionsCache = create<ActionsCacheType>((set, get) => ({
  resultCache: {},
  getCacheResult: (actionId: string) => get().resultCache[actionId],
  setResultCache: (resultCache: Record<string, any>) => set({ resultCache }),
  addResultInCache: (actionId, result) => {
    const cache = get().resultCache
    const selection = useActionStore.getState().selectionCache
    const activeAction = useActionStore.getState().activeAction
    // const setCache = useActionStore.getState().setSelectionCache()

    if (actionId === activeAction?.id && activeAction?.actionIds) {
      mog('RESULT CACHING ', { actionId, result, selection })
    }

    set({
      resultCache: { ...cache, [actionId]: result }
    })
  }
}))
