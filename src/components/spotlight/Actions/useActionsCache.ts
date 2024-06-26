import { initActions } from '@data/Actions'
import { mog } from '@utils/lib/mog'
import create from 'zustand'
import { persist, devtools } from 'zustand/middleware'

import { ActionGroup, ActionHelperConfig, LOCALSTORAGE_NAMESPACES } from '@workduck-io/action-request-helper'

import { ListItemType } from '../SearchResults/types'
import { getActionCacheKey, getIndexedResult } from './useActionPerformer'
import { ActionGroupType } from './useActionStore'
import { API } from '../../../API'

export const ACTION_CACHE_NAME = 'mex-action-cache'

type ActionsCacheType = {
  actions: Array<ListItemType>
  setActions: (actions: Array<ListItemType>) => void
  addActions: (actions: Array<ListItemType>) => void
  removeActionsByGroupId: (actionGroupId: string) => void

  actionGroups: Record<string, ActionGroupType>
  setActionGroups: (actionGroups: Record<string, ActionGroupType>) => void

  connectedGroups: Record<string, boolean>
  setConnectedGroups: (connectedGroups: Record<string, boolean>) => void

  resultCache: Record<string, any>
  getCacheResult: (actionId: string, blockId?: string) => any
  setResultCache: (resultCache: Record<string, any>) => void
  addResultInCache: (actionId: string, result: any) => void

  resultHashCache: Record<string, string>
  getResultHashCache: (key: string) => string
  addResultHash: (key: string, hash: string) => void

  clearActionCache?: () => void

  // * Actions are stored in this config
  groupedActions: Record<string, Record<string, ActionHelperConfig>>
  setGroupedActions: (groupedActions: Record<string, Record<string, ActionHelperConfig>>) => void
  addGroupedActions: (actionGroupId: string, groupedActions: Record<string, ActionHelperConfig>) => void
  getConfig: (actionGroupId: string, actionId: string) => ActionHelperConfig | undefined
}

export const useActionsCache = create<ActionsCacheType>(
  persist(
    devtools(
      (set, get) =>
        ({
          resultHashCache: {},
          getResultHashCache: (key: string) => get().resultCache[key],
          addResultHash: (key: string, hash: string) => {
            set({ resultHashCache: { ...get().resultHashCache, [key]: hash } })
          },

          actionGroups: {},
          setActionGroups: (actionGroups: Record<string, ActionGroup>) => set({ actionGroups }),

          connectedGroups: {},
          setConnectedGroups: (connectedGroups: Record<string, boolean>) => set({ connectedGroups }),

          groupedActions: {},
          setGroupedActions: (groupedActions) => set({ groupedActions }),
          addGroupedActions: (actionGroupId, groupedActions) =>
            set({ groupedActions: { ...get().groupedActions, [actionGroupId]: groupedActions } }),
          getConfig: (actionGroupId, actionId) => get().groupedActions?.[actionGroupId]?.[actionId],

          resultCache: {},
          getCacheResult: (actionId: string, blockId?: string) => {
            const savedKey = getActionCacheKey(actionId, blockId)
            const key = useActionsCache.getState().resultHashCache?.[savedKey]

            const result = API.action.getItem(LOCALSTORAGE_NAMESPACES.REQUEST_CACHE, key)
            if (result && key) {
              const isObject = !Array.isArray(result?.contextData)
              return isObject ? result : getIndexedResult(result)
            }

            return undefined
          },
          setResultCache: (resultCache: Record<string, any>) => set({ resultCache }),
          addResultInCache: (actionId, result) => {
            const cache = get().resultCache

            set({
              resultCache: { ...cache, [actionId]: result }
            })
          },

          actions: initActions,
          setActions: (actions: Array<ListItemType>) => set({ actions }),
          removeActionsByGroupId: (actionGroupId: string) => {
            const actions = get().actions.filter(
              (action) => action?.extras?.actionGroup?.actionGroupId !== actionGroupId
            )

            set({ actions })
          },

          clearActionCache: () => {
            set({
              actions: initActions,
              groupedActions: {},
              resultCache: {},
              resultHashCache: {},
              actionGroups: {},
              connectedGroups: {}
            })
          },

          addActions: (actions: Array<ListItemType>) => {
            const existingActions = get().actions
            const newActions = [...actions, ...existingActions]
            set({ actions: newActions })
          }
        } as any)
    ),

    {
      name: ACTION_CACHE_NAME,
      partialize: (state) => ({
        actions: state.actions,
        resultCache: state.resultCache,
        resultHashCache: state.resultHashCache,
        groupedActions: state.groupedActions,
        connectedGroups: state.connectedGroups,
        actionGroups: state.actionGroups
      })
      // getStorage: () => indexedDBStorage
    }
  )
)
