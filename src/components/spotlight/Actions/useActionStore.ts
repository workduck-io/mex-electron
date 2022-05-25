import create from 'zustand'
import { ActionHelperConfig, ReturnType, ActionGroup } from '@workduck-io/action-request-helper'
import { ListItemType } from '../SearchResults/types'
import { devtools, persist } from 'zustand/middleware'
import { getActionIds } from '../../../utils/actions'
import { initActions } from '../../../data/Actions'

import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { mog } from '../../../utils/lib/helper'
import useActionMenuStore from '../ActionStage/ActionMenu/useActionMenuStore'
// eslint-disable-next-line @typescript-eslint/no-var-requires

export type ActionSubType = 'form' | 'none' | undefined

export type ActiveActionType = {
  id: string
  actionIds?: Array<string>
  renderType?: ReturnType
  subType?: ActionSubType
  actionGroupId: string
  icon?: string
  name: string
  size: number
}

export type SelectionNode = {
  prev?: string
  selection?: any
}

export enum UpdateActionsType {
  REMOVE_ACTION_BY_GROUP_ID,
  AUTH_GROUPS,
  UPDATE_GROUPS,
  UPDATE_ACTION_LIST,
  CLEAR
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

  connectedGroups: Record<string, boolean>
  setConnectedGroups: (connectedGroups: Record<string, boolean>) => void

  // * Actions are stored in this config
  groupedActions: Record<string, Record<string, ActionHelperConfig>>
  setGroupedActions: (groupedActions: Record<string, Record<string, ActionHelperConfig>>) => void
  addGroupedActions: (actionGroupId: string, groupedActions: Record<string, ActionHelperConfig>) => void
  getConfig: (actionGroupId: string, actionId: string) => ActionHelperConfig | undefined

  selectedValue?: any
  setSelectedValue: (value: any) => void

  actionToPerform?: string
  setActionToPerform: (actionToPerform: string) => void

  selectionCache: Record<string, SelectionNode>
  getSelectionCache: (actionId: string) => SelectionNode
  setSelectionCache: (selectionCache: Record<string, SelectionNode>) => void
  addSelectionInCache: (actionId: string, selectionNode: SelectionNode) => void

  resultCache: Record<string, any>
  getCacheResult: (actionId: string) => any
  setResultCache: (resultCache: Record<string, any>) => void
  addResultInCache: (actionId: string, result: any) => void

  getPrevActionValue: (actionId: string) => any

  // * For now, let's store active action here
  activeAction?: ActiveActionType
  initAction: (actionGroupId: string, actionId: string) => void

  // * Selected action element in editor
  element: any
  setElement: (element: any) => void

  // * Form submit
  isSubmitting: boolean
  setIsSubmitting: (isSubmiting: boolean) => void

  //* Clear fields
  clear: () => void
}

export const useActionStore = create<ActionStoreType>(
  persist(
    devtools(
      (set, get) =>
        ({
          actionGroups: {},
          setActionGroups: (actionGroups: Record<string, ActionGroup>) => set({ actionGroups }),

          connectedGroups: {},
          setConnectedGroups: (connectedGroups: Record<string, boolean>) => set({ connectedGroups }),

          isSubmitting: false,
          setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

          resultCache: {},
          getCacheResult: (actionId: string) => get().resultCache[actionId],
          setResultCache: (resultCache: Record<string, any>) => set({ resultCache }),
          addResultInCache: (actionId, result) => {
            const cache = get().resultCache
            const selection = get().selectionCache
            const activeAction = get().activeAction

            if (actionId === activeAction?.id && activeAction?.actionIds) {
              mog('RESULT CACHING ', { actionId, result, selection })
            }

            const isMenuAction = useActionMenuStore.getState().isActionMenuOpen

            set({
              resultCache: { ...cache, [actionId]: result },
              selectionCache: isMenuAction ? selection : { ...selection, [actionId]: undefined }
            })
          },
          element: undefined,
          setElement: (element: any) => set({ element }),

          selectionCache: {},
          getSelectionCache: (actionId: string) => get().selectionCache[actionId],
          setSelectionCache: (selectionCache: Record<string, any>) => set({ selectionCache }),
          addSelectionInCache: (actionId, selection) => {
            const selectionCache = get().selectionCache
            set({
              selectionCache: { ...selectionCache, [actionId]: selection }
            })
          },

          groupedActions: {},
          setGroupedActions: (groupedActions) => set({ groupedActions }),
          addGroupedActions: (actionGroupId, groupedActions) =>
            set({ groupedActions: { ...get().groupedActions, [actionGroupId]: groupedActions } }),
          getConfig: (actionGroupId, actionId) => get().groupedActions?.[actionGroupId]?.[actionId],

          actions: initActions,
          setActions: (actions: Array<ListItemType>) => set({ actions }),
          removeActionsByGroupId: (actionGroupId: string) => {
            const actions = get().actions.filter(
              (action) => action?.extras?.actionGroup?.actionGroupId !== actionGroupId
            )

            set({ actions })
          },
          addActions: (actions: Array<ListItemType>) => {
            const existingActions = get().actions
            const newActions = [...actions, ...existingActions]
            set({ actions: newActions })
          },

          setSelectedValue: (value) => set({ selectedValue: value }),

          initAction: (actionGroupId, actionId) => {
            const actionConfigs = get().groupedActions?.[actionGroupId]
            const config = get().actionGroups?.[actionGroupId]

            const action = actionConfigs[actionId]

            const preActionId = action?.preActionId

            const renderType = action?.form ? ReturnType.NONE : action?.returnType
            const subType: ActionSubType = action?.form ? 'form' : undefined

            if (subType) useSpotlightAppStore.getState().setView('form')

            let actionIds: Array<string> | undefined

            // * Get sequence of all pre-actions required to perform this action
            if (preActionId) {
              actionIds = getActionIds(actionId, actionConfigs, [])
            }

            // * Final component will be rendered based on renderType (or with response item type)
            const activeAction = {
              id: actionId,
              actionGroupId,
              icon: config.icon,
              name: action.name,
              subType,
              actionIds,
              renderType,
              size: actionIds?.length ?? 0
            }

            set({ activeAction })
          },

          setActionToPerform: (perfomerActionId: string) => {
            set({ actionToPerform: perfomerActionId })
          },
          getPrevActionValue: (actionId: string) => {
            const activeAction = get().activeAction

            const actionConfig = get().groupedActions?.[activeAction?.actionGroupId]?.[actionId]

            const preActionId = actionConfig?.preActionId
            const cache = get().selectionCache

            // set({ activeAction })

            // * If there's a preAction of this action, get the value from cache
            if (preActionId) return cache?.[preActionId]

            // * If this is a global action, get the value from cache
            return cache?.[actionId]
          },
          clear: () => {
            set({
              selectedValue: undefined,
              activeAction: undefined,
              actionToPerform: undefined,
              actionGroups: {},
              groupedActions: {},
              connectedGroups: {},
              selectionCache: {},
              actions: initActions
            })
          }
        } as any)
    ),
    {
      name: ACTION_STORE_NAME,
      partialize: (state) => ({
        actions: state.actions,
        resultCache: state.resultCache,
        selectionCache: state.selectionCache,
        groupedActions: state.groupedActions,
        connectedGroups: state.connectedGroups,
        actionGroups: state.actionGroups
      })
      // getStorage: () => indexedDBStorage
    }
  )
)
