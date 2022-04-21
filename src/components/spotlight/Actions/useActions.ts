// * Hook for managing unauthenticated actions list in Combobox and Spotlight

import { mog } from '../../../utils/lib/helper'
import { orderBy } from 'lodash'
import { getListItemFromAction } from '../Home/helper'
import { useActionPerformer } from './useActionPerformer'
import { ActionGroupType, useActionStore } from './useActionStore'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { IpcAction } from '../../../data/IpcAction'
import { AppType } from '../../../hooks/useInitialize'
import { ActionHelperConfig, ActionGroup } from '@workduck-io/action-request-helper'

const useActions = () => {
  const addActions = useActionStore((store) => store.addActions)
  const addGroupedActions = useActionStore((store) => store.addGroupedActions)
  const setActionGroups = useActionStore((store) => store.setActionGroups)
  const removeActionsByGroupId = useActionStore((store) => store.removeActionsByGroupId)
  const { actionPerformer } = useActionPerformer()

  /*
   * Fetch all action Groups from the store
   *
   * @returns groups: Record<string, ActionGroup>
   */
  const fetchActionGroups = async () => {
    try {
      const groups: Record<string, ActionGroup> = await actionPerformer.getAllGroups()

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
      const actions: Record<string, ActionHelperConfig> = await actionPerformer.getAllActionsOfGroups(actionGroupId)

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

    for await (const actionGroupId of Object.keys(groups)) {
      await getActionsFromGroup(actionGroupId)
    }
  }

  /*
   *  After Action group authorization, add action items in the store.
   *  This would add the action items in the Combobox and Spotlight
   */
  const setActionsInList = (actionGroupId: string) => {
    const actionGroups = useActionStore.getState().actionGroups
    const groupedActionConfigs = useActionStore.getState().groupedActions

    const group = actionGroups?.[actionGroupId]

    if (group) {
      const actionsConfigList = Object.values(groupedActionConfigs?.[actionGroupId] ?? {}).filter(
        (config) => config.visibility
      )

      if (actionsConfigList) {
        const actionList = actionsConfigList.map((action) => getListItemFromAction(action, group))
        addActions(actionList)
        appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { actionList })
      }
    }
  }

  const sortActionGroups = (actionGroups: Record<string, ActionGroupType>) => {
    const res = orderBy(Object.values(actionGroups), ['enabled', 'connected', 'actionGroupId'], ['desc', 'desc', 'asc'])
    return res
  }

  // * For Integrations page, check for Authorized action groups
  const getAuthorizedGroups = async (forceUpdate?: boolean) => {
    const groupsAuth = await actionPerformer.getAllAuths(forceUpdate)
    const groups = useActionStore.getState().actionGroups
    const actionGroups = { ...groups }

    if (groupsAuth) {
      Object.values(actionGroups).forEach((actionGroup) => {
        const authTypeIds = Object.keys(groupsAuth)

        let connected = false

        for (const authTypeId of authTypeIds) {
          if (actionGroup?.authConfig?.authTypeId === authTypeId) {
            connected = true
            if (!actionGroup.connected) setActionsInList(actionGroup.actionGroupId)
            break
          }
        }

        if (!connected) {
          removeActionsByGroupId(actionGroup.actionGroupId)
        }

        if (actionGroups[actionGroup.actionGroupId]) {
          actionGroups[actionGroup.actionGroupId] = { ...actionGroup, connected }
        }
      })

      setActionGroups(actionGroups)
      appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { groups: actionGroups })
    }
  }

  const clearActionStore = () => {
    actionPerformer.clearStore()
    useActionStore.getState().clear()
  }

  return {
    getGroupsToView,
    setActionsInList,
    getAuthorizedGroups,
    sortActionGroups,
    clearActionStore
  }
}

export default useActions
