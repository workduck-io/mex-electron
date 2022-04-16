import create from 'zustand'
import { ActionHelperConfig, ReturnType, ActionGroup } from '@workduck-io/action-request-helper'
import { actionGroups, actionsConfig } from './data'
import { ListItemType } from '../SearchResults/types'
import { persist } from 'zustand/middleware'

type ActiveActionType = {
  id: string
  actionIds?: Array<string>
  renderType?: ReturnType
  isReady?: boolean
  at: number
  size: number
}

const ACTION_STORE_NAME = 'mex-action-store'

// * recurse through the action config and create a list of all the action ids
const getActionIds = (actionId: string, actionConfigs: Record<string, ActionHelperConfig>, arr: Array<string>) => {
  const config = actionConfigs[actionId]

  // * recurse config to get all the action ids

  const preActionId = config?.preActionId

  if (preActionId && !arr.includes(preActionId)) {
    getActionIds(preActionId, actionConfigs, arr)
    arr.push(preActionId)
  }

  return arr
}

// * Create new ACTION ITEM in the store
const newAction = (actionId: string): { data: any; value: any; actionId?: string } => {
  return { actionId, data: null, value: null }
}

type ActionStoreType = {
  actions: Array<ListItemType>
  setActions: (actions: Array<ListItemType>) => void

  actionGroups: Record<string, ActionGroup>
  setActionGroups: (actionGroups: Record<string, ActionGroup>) => void

  selectedValue?: any
  setSelectedValue: (value: any) => void

  actionToPerform?: string
  setActionToPerform: (actionToPerform: string) => void

  // * Actions are stored in this config
  actionConfigs: Record<string, ActionHelperConfig>
  setActionConfigs: (actionConfigs: Record<string, ActionHelperConfig>) => void

  // * Performed Action cache map
  actionsCache: Record<string, Array<Record<string, any>>> | Record<string, any>
  addActionInCache: (actionId: string, response: any) => void
  updateValueInCache: (actionId: string, value: any) => void
  getPrevActionValue: (actionId: string) => any
  getCachedAction: (actionId: string) => any | undefined

  // * For now, let's store active action here
  activeAction?: ActiveActionType
  setPerformingActionIndex: (performingActionId: string) => void
  initAction: (actionId: string) => void

  //* Clear fields
  clear: () => void
}

export const useActionStore = create<ActionStoreType>(
  persist(
    (set, get) => ({
      actions: [],
      setActions: (actions: Array<ListItemType>) => set({ actions }),

      actionGroups: actionGroups,
      setActionGroups: (actionGroups: Record<string, ActionGroup>) => set({ actionGroups }),

      actionConfigs: actionsConfig(),
      setActionConfigs: (actionConfigs: Record<string, any>) => set({ actionConfigs }),

      setPerformingActionIndex: (performingActionId) => {
        const activeAction = get().activeAction
        const updatedAction = { ...activeAction, at: activeAction?.actionIds?.indexOf(performingActionId) }
        set({ activeAction: updatedAction })
      },

      setSelectedValue: (value) => set({ selectedValue: value }),

      initAction: (actionId) => {
        const actionConfigs = get().actionConfigs
        const actionCache = get().actionsCache

        // * Check if preActionId exists in config
        const renderType = actionConfigs[actionId]?.returnType
        const preActionId = actionConfigs[actionId]?.preActionId

        let actionToPerform = actionId
        let actionIds: Array<string> | undefined

        if (preActionId) {
          actionIds = getActionIds(actionId, actionConfigs, [])
          actionToPerform = actionIds[0]
        }

        if (actionCache[actionId]) {
          actionToPerform = actionId
        }

        // * Final component will be rendered based on renderType (or with response item type)
        const activeAction = { id: actionId, actionIds, renderType, at: 0, size: actionIds?.length ?? 0 }

        set({ activeAction, actionToPerform })
      },

      setActionToPerform: (perfomerActionId: string) => {
        set({ actionToPerform: perfomerActionId })
      },

      actionsCache: {},
      addActionInCache: (actionId, response) => {
        const activeAction = get().activeAction
        const actionsCache = get().actionsCache
        // const preActionId = get().actionConfigs?.[actionId]?.preActionId

        // * Check if we can cache this action

        const cachedActions: Array<Record<string, any>> = actionsCache?.[activeAction?.id] ?? []
        const newActions = cachedActions.filter((action) => action.actionId !== actionId)
        const updatedActions = [...newActions, { data: response, value: null, actionId }]

        actionsCache[activeAction?.id] = updatedActions

        set({ actionsCache })
      },

      updateValueInCache: (actionId, selection) => {
        const actionsCache = get().actionsCache
        const activeAction = get().activeAction

        // * If this is global action, update the value in cache
        const globalCache = false
        // const globalCache = actionsCache[actionId]?.value
        if (globalCache) {
          // actionsCache[actionId].value = selection.value
          // set({ actionsCache })
        }

        // * If this scoped action, update the value in action's cache
        else {
          const cachedActions: Array<Record<string, any>> = actionsCache[activeAction?.id] ?? []
          const index = cachedActions.findIndex((cached) => cached.actionId === actionId)

          const actions = cachedActions.slice(0, index)

          const updatedActions = [...actions, { ...cachedActions[index], value: selection.value }]

          const size = activeAction?.size - 1
          const updatedAt = activeAction?.actionIds.indexOf(actionId)
          const at = size < updatedAt + 1 ? size : updatedAt + 1

          const isReady = size === updatedAt
          const actionToPerform = isReady ? activeAction.id : activeAction.actionIds[at]

          actionsCache[activeAction?.id] = updatedActions

          const updatedActiveAction = { ...activeAction, at }

          set({ actionsCache, activeAction: updatedActiveAction, actionToPerform, selectedValue: selection.value })
        }
      },

      getCachedAction: (actionId: string) => {
        const activeAction = get().activeAction
        const actionsCache = get().actionsCache

        // * If this is global action, return the value from cache
        // if (actionsCache[actionId]?.data) return actionsCache[actionId]

        const cachedAction = actionsCache?.[activeAction?.id]?.find((action) => action.actionId === actionId)

        if (cachedAction) {
          return cachedAction
        }

        return undefined
      },

      getPrevActionValue: () => {
        const activeAction = get().activeAction
        const at = activeAction?.at
        const actionToPerform = get().actionToPerform
        const actionId = activeAction?.actionIds?.[at]
        const cachedAction = actionId && get().getCachedAction(actionId)

        if (activeAction.id === actionToPerform) return cachedAction

        // if (cachedAction?.value) {
        //   return cachedAction
        // }

        const prevActionId = activeAction?.actionIds?.[at - 1]
        const prevAction = get().getCachedAction(prevActionId)

        return prevAction
      },

      clear: () => {
        set({
          selectedValue: undefined,
          activeAction: undefined,
          actionToPerform: undefined
        })
      }
    }),
    {
      name: ACTION_STORE_NAME,
      partialize: (state) => ({ actionConfigs: state.actionConfigs, actionsCache: state.actionsCache })
    }
  )
)
