import { useActionStore } from './useActionStore'
import { ActionHelperClient, ClickPostActionType } from '@workduck-io/action-request-helper'
import { client } from '@workduck-io/dwindle'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { mog } from '../../../utils/lib/helper'
import { useMemo } from 'react'

type PerfomerOptions = {
  fetch?: boolean
  formData: Record<string, any>
}

export const useActionPerformer = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const addResultInCache = useActionStore((store) => store.addResultInCache)
  const getPrevActionValue = useActionStore((store) => store.getPrevActionValue)
  const getSelection = useActionStore((store) => store.getSelectionCache)
  const setIsLoading = useSpotlightAppStore((store) => store.setIsLoading)
  const actionToPerform = useActionStore((store) => store.actionToPerform)
  const groupedAction = useActionStore((store) => store.groupedActions)
  const view = useSpotlightAppStore((store) => store.view)

  const actionPerformer = useMemo(() => {
    // * REMOVE: For testing purposes
    const workspaceId = 'WORKSPACEBBR1Z6DEWP877Z6431TT69ZSXM6917993H6NCMXZRWQLD0CMWL01'

    // * const workspaceId = useAuthStore.getState().getWorkspaceId()
    return new ActionHelperClient(client, workspaceId)
  }, [])

  /* 
    Looks for the action in the cache first,
    Performs an actions and retur1n's the result
    if not found, it will perform the action and add it to the cache
  */

  const performer = async (actionGroupId: string, actionId: string, options?: PerfomerOptions) => {
    const actionConfig = groupedAction?.[actionGroupId]?.[actionId]
    const prevActionValue = getPrevActionValue(actionId)?.selection

    // * if we have a cache, return the cached result
    // if (!fetch) {
    //   const cache = getCachedAction(actionId)
    //   if (cache?.data) return { ...cache?.data, value: cache?.value }
    // }

    if (!actionConfig) return

    setIsLoading(true)

    // * Get Auth Config from local storage or else call API
    const auth = await actionPerformer.getAuth(actionConfig?.authTypeId)
    const serviceType = actionConfig?.authTypeId?.split('_')?.[0]?.toLowerCase()
    const configVal = options?.formData
      ? { ...prevActionValue?.value, formData: options.formData }
      : prevActionValue?.value

    try {
      // * if we have a previous action selection, use that
      const result = await actionPerformer.request({
        config: actionConfig,
        auth,
        configVal,
        serviceType
      })

      const resultAction = actionConfig?.postAction?.result
      const isRunAction = resultAction?.type === ClickPostActionType.RUN_ACTION

      if (isRunAction) {
        const postAction = await actionPerformer.request({
          config: groupedAction?.[actionGroupId]?.[resultAction?.actionId],
          auth,
          configVal: result.contextData,
          serviceType
        })

        mog('POST ACTION RESULT', { postAction })
      }

      setIsLoading(false)

      addResultInCache(actionId, result)

      mog(`RESULT PERFOMER: ${actionId}`, { result })

      return result
    } catch (err) {
      mog('Something went wrong', { err })
      setIsLoading(false)
    }

    return undefined
  }

  const isPerformer = (actionId: string) => {
    const selection = getSelection(actionId)
    const prevActionValue = getPrevActionValue(actionId)
    const action = getConfig(activeAction?.actionGroupId, actionId)

    const hasPrevValueChanged = prevActionValue?.selection && selection?.prev !== prevActionValue?.selection?.label
    const hasPreAction = action?.preActionId

    return hasPreAction ? hasPrevValueChanged : !hasPrevValueChanged
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
