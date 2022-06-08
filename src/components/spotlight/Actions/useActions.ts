// * Hook for managing unauthenticated actions list in Combobox and Spotlight

import { mog } from '../../../utils/lib/helper'
import { orderBy } from 'lodash'
import { getListItemFromAction } from '../Home/helper'
import { ActionGroupType, UpdateActionsType } from './useActionStore'
import { useActionsCache } from './useActionsCache'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { IpcAction } from '../../../data/IpcAction'
import { AppType } from '../../../hooks/useInitialize'
import { ActionHelperConfig, ActionGroup, LOCALSTORAGE_NAMESPACES } from '@workduck-io/action-request-helper'
import { actionPerformer } from './useActionPerformer'

const useActions = () => {
  const addActions = useActionsCache((store) => store.addActions)
  const addGroupedActions = useActionsCache((store) => store.addGroupedActions)
  const setActionGroups = useActionsCache((store) => store.setActionGroups)
  const setConnectedGroups = useActionsCache((store) => store.setConnectedGroups)
  /*
   * Fetch all action Groups from the store
   *
   * @returns groups: Record<string, ActionGroup>
   */
  const fetchActionGroups = async () => {
    try {
      const groups: Record<string, ActionGroup> = await actionPerformer?.getAllGroups(true)

      setActionGroups(groups)
      appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { groups })

      return groups
    } catch (err) {
      mog('Failed to fetch action groups', { err })
    }
  }

  /*
   * Fetch all action Configs of a group
   *
   * @params actionGroupId: string
   * @returns actionConfigs: Record<string, ActionHelperConfig>
   */
  const getActionsFromGroup = async (actionGroupId: string) => {
    try {
      const actions: Record<string, ActionHelperConfig> = await actionPerformer?.getAllActionsOfGroups(actionGroupId)

      addGroupedActions(actionGroupId, actions)
      appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { actionGroupId: actionGroupId, actions })

      return actions
    } catch (err) {
      mog('Failed to fetch actions of group', { err })
    }
  }

  // * For Integrations page, get all Action groups and all actions of each group
  const getGroupsToView = async () => {
    const groups = await fetchActionGroups()

    try {
      await Promise.allSettled(
        Object.keys(groups).map(async (actionGroupId) => await getActionsFromGroup(actionGroupId))
      )
    } catch (err) {
      mog('Failed to fetch actions of group', { err })
    }

    // * Get auth of all action groups
    await getAuthorizedGroups(true)
  }

  /*
   *  After Action group authorization, add action items in the store.
   *  This would add the action items in the Combobox and Spotlight
   */
  const setActionsInList = (actionGroupId: string, add = true) => {
    const actionGroups = useActionsCache.getState().actionGroups
    const groupedActionConfigs = useActionsCache.getState().groupedActions

    const group = actionGroups?.[actionGroupId]

    if (group) {
      const actionsConfigList = Object.values(groupedActionConfigs?.[actionGroupId] ?? {}).filter(
        (config) => config.visibility
      )

      if (actionsConfigList) {
        const actionList = actionsConfigList.map((action) => getListItemFromAction(action, group))

        if (add) {
          addActions(actionList)
          appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { actionList })
        }

        return actionList
      }
    }
  }

  const getIsServiceConfigured = (actionGroupId: string, actionId: string) => {
    const actionGroup = useActionsCache.getState().actionGroups
    const isGlobal = !!actionGroup?.[actionId]?.globalActionId

    const globalIdsCache = !!actionPerformer.getGlobalId(LOCALSTORAGE_NAMESPACES.GLOBAL, actionGroupId)

    return isGlobal && globalIdsCache
  }

  const getIsServiceConnected = (actionGroupId: string) => {
    const connectedGroups = useActionsCache.getState().connectedGroups

    return connectedGroups?.[actionGroupId]
  }

  const sortActionGroups = (
    actionGroups: Record<string, ActionGroupType>,
    getIsConnected: (item: ActionGroupType) => boolean
  ) => {
    const res = orderBy(
      Object.values(actionGroups).map((item) => ({ ...item, connected: getIsConnected(item) })),
      ['connected', 'actionGroupId'],
      ['desc', 'asc']
    )

    return res
  }

  // * For Integrations page, check for Authorized action groups
  const getAuthorizedGroups = async (forceUpdate?: boolean) => {
    const groupsAuth = await actionPerformer?.getAllAuths(forceUpdate)
    const actionGroups = useActionsCache.getState().actionGroups
    const connected = useActionsCache.getState().connectedGroups
    const connectedGroups = { ...connected }

    if (groupsAuth) {
      Object.values(actionGroups).forEach((actionGroup) => {
        const authTypeIds = Object.keys(groupsAuth)

        let connected = false
        for (const authTypeId of authTypeIds) {
          if (actionGroup?.authConfig?.authTypeId === authTypeId) {
            connected = true

            if (!connectedGroups[actionGroup?.actionGroupId]) {
              setActionsInList(actionGroup.actionGroupId)
            }

            break
          }
        }

        connectedGroups[actionGroup.actionGroupId] = connected
      })

      setConnectedGroups(connectedGroups)
      appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { connectedGroups, type: UpdateActionsType.AUTH_GROUPS })
    }
  }

  const clearActionStore = () => {
    actionPerformer?.clearStore()
    // ! Clear action result
    // useActionStore()
    appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { type: UpdateActionsType.CLEAR })
  }

  return {
    getGroupsToView,
    setActionsInList,
    getAuthorizedGroups,
    sortActionGroups,
    clearActionStore,
    getIsServiceConnected,
    getIsServiceConfigured
  }
}

export default useActions
