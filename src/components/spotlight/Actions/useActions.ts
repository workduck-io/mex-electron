// * Hooks for managing unauthenticated actions list in Combobox and Spotlight

import { initActions } from '../../../data/Actions'
import { getListItemFromAction } from '../Home/helper'
import { useActionStore } from './useActionStore'

const useActions = () => {
  const setActions = useActionStore((store) => store.setActions)
  const actionGroups = useActionStore((store) => store.actionGroups)
  const actionConfigs = useActionStore((store) => store.actionConfigs)
  /*
   * TODO:
   *   1. Init actions in combobox
   *   2. Init actions for spotlight list
   */

  const getActionsFromConfig = () => {
    const visibleConfigs = Object.values(actionConfigs).filter((config) => config.visibility)
    const actions = visibleConfigs.map((actionConfig) => {
      const actionGroup = actionGroups[actionConfig.actionGroupId]
      return getListItemFromAction(actionConfig, actionGroup)
    })

    return actions
  }

  const initActionsInStore = () => {
    const authActions = getActionsFromConfig()
    const allActions = [...authActions, ...initActions]

    setActions(allActions)
  }

  return {
    initActionsInStore
  }
}

export default useActions
