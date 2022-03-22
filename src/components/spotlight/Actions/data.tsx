import { ActionHelperConfig, AuthTypeId, ActionGroup } from '@workduck-io/action-request-helper'
import * as actionConfig from './actionConfigs'

/*
  Generate <actionID, config>
*/
export const actionsConfig = (): Record<string, ActionHelperConfig> => {
  // * TBD: Remove this
  // const actionConfig = {} as ActionHelperConfig

  return Object.values(actionConfig).reduce(
    (configs, currentActionConfig) => ({ ...configs, [currentActionConfig.actionId]: currentActionConfig }),
    {}
  )
}

// export const actionGroups: Record<string, ActionGroup> = {
//   GITHUB: {
//     authTypeId: AuthTypeId.GITHUB_OAUTH,
//     id: 'GITHUB',
//     name: 'Github',
//     icon: 'codicon:github'
//   },
//   LINEAR: {
//     authTypeId: AuthTypeId.LINEAR_AUTH,
//     id: 'LINEAR',
//     name: 'Linear',
//     icon: 'gg:linear'
//   },
//   ASANA: {
//     authTypeId: AuthTypeId.ASANA_AUTH,
//     id: 'ASANA',
//     name: 'Asana',
//     icon: 'cib:asana'
//   }
// }
