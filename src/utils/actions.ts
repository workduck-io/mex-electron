import { ActionHelperConfig } from '@workduck-io/action-request-helper'

// * recurse through the action config and create a list of all the action ids
export const getActionIds = (
  actionId: string,
  actionConfigs: Record<string, ActionHelperConfig>,
  arr: Array<string>
) => {
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
export const newAction = (actionId: string): { data: any; value: any; actionId?: string } => {
  return { actionId, data: null, value: null }
}
