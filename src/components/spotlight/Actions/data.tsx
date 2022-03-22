import { ActionHelperConfig } from '@workduck-io/action-request-helper'
// import * as actionConfig from './actionConfigs'

/*
  Generate <actionID, config>
*/
export const actionsConfig = (): Record<string, ActionHelperConfig> => {
  // * TBD: Remove this
  const actionConfig = {} as ActionHelperConfig

  return Object.values(actionConfig).reduce(
    (configs, currentActionConfig) => ({ ...configs, [currentActionConfig.actionId]: currentActionConfig }),
    {}
  )
}
