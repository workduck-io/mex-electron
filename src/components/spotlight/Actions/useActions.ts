// * Hook for managing unauthenticated actions list in Combobox and Spotlight

import { mog } from '../../../utils/lib/helper'
import { orderBy } from 'lodash'
import { getListItemFromAction } from '../Home/helper'
import { ActionGroupType, UpdateActionsType, useActionStore } from './useActionStore'
import { appNotifierWindow } from '../../../electron/utils/notifiers'
import { IpcAction } from '../../../data/IpcAction'
import { AppType } from '../../../hooks/useInitialize'
import { ActionHelperConfig, ActionGroup } from '@workduck-io/action-request-helper'
import { actionPerformer } from './useActionPerformer'

const useActions = () => {
  const addActions = useActionStore((store) => store.addActions)
  const addGroupedActions = useActionStore((store) => store.addGroupedActions)
  const setActionGroups = useActionStore((store) => store.setActionGroups)
  const setConnectedGroups = useActionStore((store) => store.setConnectedGroups)
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
    mog(`${actionGroupId}`)

    if (group) {
      const actionsConfigList = Object.values(groupedActionConfigs?.[actionGroupId] ?? {}).filter(
        (config) => config.visibility
      )

      if (actionsConfigList) {
        const actionList = actionsConfigList.map((action) => getListItemFromAction(action, group))

        mog(`${actionGroupId} list`, { actionList, actionGroupId })
        addActions(actionList)
        appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { actionList })
      }
    }
  }

  const sortActionGroups = (
    actionGroups: Record<string, ActionGroupType>,
    connectedGroups: Record<string, boolean>
  ) => {
    const res = orderBy(
      Object.values(actionGroups).map((item) => ({ ...item, connected: connectedGroups[item.actionGroupId] })),
      ['connected', 'actionGroupId'],
      ['desc', 'asc']
    )

    return res
  }

  // * For Integrations page, check for Authorized action groups
  const getAuthorizedGroups = async (forceUpdate?: boolean) => {
    const groupsAuth = await actionPerformer?.getAllAuths(forceUpdate)
    const actionGroups = useActionStore.getState().actionGroups
    const connected = useActionStore.getState().connectedGroups
    const connectedGroups = { ...connected }

    if (groupsAuth) {
      Object.values(actionGroups).forEach((actionGroup) => {
        const authTypeIds = Object.keys(groupsAuth)

        let connected = false

        for (const authTypeId of authTypeIds) {
          if (actionGroup?.authConfig?.authTypeId === authTypeId) {
            connected = true

            if (!connectedGroups[actionGroup?.actionGroupId]) {
              mog(`----- ${actionGroup?.actionGroupId} -----`)
              setActionsInList(actionGroup.actionGroupId)
            }

            break
          }
        }

        // if (!connected) {
        //   removeActionsByGroupId(actionGroup.actionGroupId)
        // }

        connectedGroups[actionGroup.actionGroupId] = connected
      })

      setConnectedGroups(connectedGroups)
      appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { connectedGroups, type: UpdateActionsType.AUTH_GROUPS })
    }
  }

  const clearActionStore = () => {
    actionPerformer?.clearStore()
    useActionStore.getState().clear()
    appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, { type: UpdateActionsType.CLEAR })
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