import create from 'zustand'
import createContext from 'zustand/context'
import { ReturnType, ActionGroup } from '@workduck-io/action-request-helper'
import { devtools } from 'zustand/middleware'
import { getActionIds } from '../../../utils/actions'

import { ViewDataType, ViewType } from '../../../store/app.spotlight'
import { useActionsCache } from './useActionsCache'
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
  selectedValue?: any
  setSelectedValue: (value: any) => void

  isLoading?: boolean
  setIsLoading?: (isLoading?: boolean) => void

  actionToPerform?: string
  setActionToPerform: (actionToPerform: string) => void

  selectionCache: Record<string, SelectionNode>
  getSelectionCache: (actionId: string) => SelectionNode
  setSelectionCache: (selectionCache: Record<string, SelectionNode>) => void
  addSelectionInCache: (actionId: string, selectionNode: SelectionNode) => void

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

  view?: ViewType
  setView: (value: ViewType) => void

  viewData: ViewDataType
  setViewData: (value: ViewDataType) => void

  isMenuOpen: boolean
  setIsMenuOpen: (value: boolean) => void

  initActionWithElement: (actionContext: any) => void

  //* Clear fields
  clear: () => void
}

export const { Provider, useStore: useActionStore } = createContext<ActionStoreType>()

export const actionStore = () =>
  create<ActionStoreType>(
    devtools(
      (set, get) =>
        ({
          isSubmitting: false,
          setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

          element: undefined,
          setElement: (element: any) => set({ element }),

          isLoading: false,
          setIsLoading: (isLoading: boolean) => set({ isLoading }),

          selectionCache: {},
          getSelectionCache: (actionId: string) => get().selectionCache[actionId],
          setSelectionCache: (selectionCache: Record<string, any>) => set({ selectionCache }),
          addSelectionInCache: (actionId, selection) => {
            const selectionCache = get().selectionCache
            set({
              selectionCache: { ...selectionCache, [actionId]: selection }
            })
          },

          setSelectedValue: (value) => set({ selectedValue: value }),

          initActionWithElement: (actionContext: any) => {
            if (actionContext?.selections) get().setSelectionCache(actionContext?.selections)

            get().initAction(actionContext?.actionGroupId, actionContext?.actionId)
          },

          initAction: (actionGroupId, actionId) => {
            const actionConfigs = useActionsCache?.getState()?.groupedActions?.[actionGroupId]
            const config = useActionsCache?.getState()?.actionGroups?.[actionGroupId]

            const action = actionConfigs?.[actionId]

            const preActionId = action?.preActionId

            const renderType = action?.form ? ReturnType.NONE : action?.returnType
            const subType: ActionSubType = action?.form ? 'form' : undefined

            if (subType) get().setView('form')

            let actionIds: Array<string> | undefined

            // * Get sequence of all pre-actions required to perform this action
            if (preActionId) {
              actionIds = getActionIds(actionId, actionConfigs, [])
            }

            // * Final component will be rendered based on renderType (or with response item type)
            const activeAction = {
              id: actionId,
              actionGroupId,
              icon: config?.icon,
              name: action?.name,
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
            const groupedActions = useActionsCache?.getState()?.groupedActions

            const actionConfig = groupedActions?.[activeAction?.actionGroupId]?.[actionId]

            const preActionId = actionConfig?.preActionId
            const cache = get().selectionCache

            // set({ activeAction })

            // * If there's a preAction of this action, get the value from cache
            if (preActionId) return cache?.[preActionId]

            // * If this is a global action, get the value from cache
            return cache?.[actionId]
          },

          // Mode for list if false, the editor takes full screen
          isMenuOpen: false,
          setIsMenuOpen: (value: boolean) => set({ isMenuOpen: value }),

          viewData: undefined,
          setViewData: (value: ViewDataType) => set({ viewData: value }),

          setView: (value: ViewType) => set({ view: value }),

          clear: () => {
            set({
              selectedValue: undefined,
              activeAction: undefined,
              actionToPerform: undefined,
              selectionCache: {},
              view: undefined,
              viewData: undefined,
              isMenuOpen: false
            })
          }
        } as any)
    )
  )
