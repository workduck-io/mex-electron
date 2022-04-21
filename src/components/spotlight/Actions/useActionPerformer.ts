import { useActionStore } from './useActionStore'
import { ActionHelperClient } from '@workduck-io/action-request-helper'
import { client } from '@workduck-io/dwindle'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { mog } from '../../../utils/lib/helper'
import { useMemo } from 'react'

export const useActionPerformer = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const addActionInCache = useActionStore((store) => store.addActionInCache)
  const getPrevActionValue = useActionStore((store) => store.getPrevActionValue)
  const setIsLoading = useSpotlightAppStore((store) => store.setIsLoading)
  const actionToPerform = useActionStore((store) => store.actionToPerform)
  const groupedAction = useActionStore((store) => store.groupedActions)

  const actionPerformer = useMemo(() => {
    // * REMOVE: For testing purposes
    const workspaceId = 'WORKSPACEBBR1Z6DEWP877Z6431TT69ZSXM6917993H6NCMXZRWQLD0CMWL01'

    // * const workspaceId = useAuthStore.getState().getWorkspaceId()
    return new ActionHelperClient(client, workspaceId)
  }, [])

  /* 
    Looks for the action in the cache first,
    Performs an actions and return's the result
    if not found, it will perform the action and add it to the cache
  */

  const performer = async (actionGroupId: string, actionId: string, fetch?: boolean) => {
    const actionConfig = groupedAction?.[actionGroupId]?.[actionId]
    const prevActionValue = getPrevActionValue(actionId)

    // * if we have a cache, return the cached result
    // if (!fetch) {
    // const cache = getCachedAction(actionId)
    // if (cache?.data) return { ...cache?.data, value: cache?.value }
    // }

    setIsLoading(true)

    // * Get Auth Config from local storage or else call API
    const auth = await actionPerformer.getAuth(actionConfig?.authTypeId)

    try {
      // * if we have a previous action selection, use that
      const actionRes = await actionPerformer.request({
        config: actionConfig,
        auth,
        configVal: prevActionValue?.value,
        serviceType: actionConfig.authTypeId.split('_')[0].toLowerCase()
      })

      setIsLoading(false)

      addActionInCache(actionId, actionRes)

      return actionRes
    } catch (err) {
      mog('Something went wrong', { err })
      setIsLoading(false)
    }

    return undefined
  }

  const isPerformer = (actionId: string) => {
    return actionToPerform === actionId
  }

  const isReady = () => {
    return activeAction?.id === actionToPerform
  }

  const getConfig = (actionGroupId: string, actionId: string) => groupedAction?.[actionGroupId]?.[actionId]

  return {
    isPerformer,
    performer,
    isReady,
    getConfig,
    actionPerformer
  }
}
