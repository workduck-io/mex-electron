import create from 'zustand'
import { ActionHelperConfig, ReturnType, ActionGroup } from '@workduck-io/action-request-helper'
import { ListItemType } from '../SearchResults/types'
import { devtools, persist } from 'zustand/middleware'
import { getActionIds } from '../../../utils/actions'
import { initActions } from '../../../data/Actions'
import { mog } from '../../../utils/lib/helper'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { IpcAction } from '../../../data/IpcAction'
import { AppType } from '../../../hooks/useInitialize'
// eslint-disable-next-line @typescript-eslint/no-var-requires

export type ActiveActionType = {
  id: string
  actionIds?: Array<string>
  renderType?: ReturnType
  actionGroupId: string
  isReady?: boolean
  at: number
  size: number
}

export enum UpdateActionsType {
  REMOVE_ACTION_BY_GROUP_ID
}

const ACTION_STORE_NAME = 'mex-action-store'

export type ActionGroupType = ActionGroup & { connected?: boolean }

type ActionStoreType = {
  actions: Array<ListItemType>
  setActions: (actions: Array<ListItemType>) => void
  addActions: (actions: Array<ListItemType>) => void
  removeActionsByGroupId: (actionGroupId: string) => void

  actionGroups: Record<string, ActionGroupType>
  setActionGroups: (actionGroups: Record<string, ActionGroupType>) => void

  // * Actions are stored in this config
  groupedActions: Record<string, Record<string, ActionHelperConfig>>
  setGroupedActions: (groupedActions: Record<string, Record<string, ActionHelperConfig>>) => void
  addGroupedActions: (actionGroupId: string, groupedActions: Record<string, ActionHelperConfig>) => void

  selectedValue?: any
  setSelectedValue: (value: any) => void

  actionToPerform?: string
  setActionToPerform: (actionToPerform: string) => void

  // * Performed Action cache map
  actionsCache: Record<string, Array<Record<string, any>>> | Record<string, any>
  addActionInCache: (actionId: string, response: any) => void
  updateValueInCache: (actionId: string, value: any) => void
  getPrevActionValue: (actionId: string) => any
  getCachedAction: (actionId: string) => any | undefined

  // * For now, let's store active action here
  activeAction?: ActiveActionType
  setPerformingActionIndex: (performingActionId: string) => void
  initAction: (actionGroupId: string, actionId: string) => void

  //* Clear fields
  clear: () => void
}

export const useActionStore = create<ActionStoreType>(
  persist(
    devtools((set, get) => ({
      actionGroups: {},
      setActionGroups: (actionGroups: Record<string, ActionGroup>) => set({ actionGroups }),

      groupedActions: {},
      setGroupedActions: (groupedActions) => set({ groupedActions }),
      addGroupedActions: (actionGroupId, groupedActions) =>
        set({ groupedActions: { ...get().groupedActions, [actionGroupId]: groupedActions } }),

      actions: initActions,
      setActions: (actions: Array<ListItemType>) => set({ actions }),
      removeActionsByGroupId: (actionGroupId: string) => {
        const actions = get().actions.filter((action) => action?.extras?.actionGroup?.actionGroupId !== actionGroupId)
        set({ actions })
        appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, {
          actions,
          type: UpdateActionsType.REMOVE_ACTION_BY_GROUP_ID
        })
      },
      addActions: (actions: Array<ListItemType>) => {
        const existingActions = get().actions
        const newActions = [...actions, ...existingActions]
        set({ actions: newActions })
      },

      setPerformingActionIndex: (performingActionId) => {
        const activeAction = get().activeAction
        const updatedAction = { ...activeAction, at: activeAction?.actionIds?.indexOf(performingActionId) }
        set({ activeAction: updatedAction })
      },

      setSelectedValue: (value) => set({ selectedValue: value }),

      initAction: (actionGroupId, actionId) => {
        const actionConfigs = get().groupedActions?.[actionGroupId]
        const actionCache = get().actionsCache

        const action = actionConfigs[actionId]

        const preActionId = action?.preActionId

        const renderType = action?.returnType

        let actionToPerform = actionId
        let actionIds: Array<string> | undefined

        // * Get sequence of all pre-actions required to perform this action
        if (preActionId) {
          actionIds = getActionIds(actionId, actionConfigs, [])
          actionToPerform = actionIds[0]
        }

        if (actionCache[actionId]) {
          actionToPerform = actionId
        }

        // * Final component will be rendered based on renderType (or with response item type)
        const activeAction = { id: actionId, actionGroupId, actionIds, renderType, at: 0, size: actionIds?.length ?? 0 }

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

        mog('action-store', { response, actionId })

        const cachedActions: Array<Record<string, any>> = actionsCache?.[activeAction?.id] ?? []
        const newActions = cachedActions.filter((action) => action.actionId !== actionId)
        const updatedActions = [...newActions, { data: response, value: null, actionId }]
        mog('Updating', { updatedActions })

        if (activeAction?.id) {
          actionsCache[activeAction?.id] = updatedActions
          set({ actionsCache })
        }
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
    })),
    {
      name: ACTION_STORE_NAME,
      partialize: (state) => ({
        actions: state.actions,
        // actionsCache: state.actionsCache,
        actionGroups: state.actionGroups,
        groupedActions: state.groupedActions
      })
    }
  )
)
