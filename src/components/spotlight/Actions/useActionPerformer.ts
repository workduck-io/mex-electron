import { useActionStore } from './useActionStore'
import {
  ActionHelperClient,
  ActionHelperConfig,
  ActionResponse,
  ClickPostActionType
} from '@workduck-io/action-request-helper'
import { client } from '@workduck-io/dwindle'
import { useSpotlightAppStore } from '../../../store/app.spotlight'
import { mog } from '../../../utils/lib/helper'
import { NavigationType, useRouting } from '../../../views/routes/urls'
import { ACTION_ENV } from '../../../apis/routes'

type PerfomerOptions = {
  formData?: Record<string, any>
  fetch?: boolean
  parent?: boolean
}

export const actionPerformer = new ActionHelperClient(client, undefined, ACTION_ENV)

const getIndexedResult = (res: ActionResponse) => {
  const d: ActionResponse = {
    ...res,
    displayData: res?.displayData?.map((data, index) => [...data, { key: 'index', type: 'hidden', value: index }])
  }

  return d
}

export const useActionPerformer = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const addResultInCache = useActionStore((store) => store.addResultInCache)
  const getPrevActionValue = useActionStore((store) => store.getPrevActionValue)
  const getSelection = useActionStore((store) => store.getSelectionCache)
  const setIsLoading = useSpotlightAppStore((store) => store.setIsLoading)
  const actionToPerform = useActionStore((store) => store.actionToPerform)
  const groupedAction = useActionStore((store) => store.groupedActions)
  const setView = useSpotlightAppStore((store) => store.setView)
  const setViewData = useSpotlightAppStore((store) => store.setViewData)

  const { goTo } = useRouting()

  /* 
    Looks for the action in the cache first,
    Performs an actions and return's the result
    if not found, it will perform the action and add it to the cache
  */
  const performer = async (actionGroupId: string, actionId: string, options?: PerfomerOptions) => {
    const actionConfig = groupedAction?.[actionGroupId]?.[actionId]
    const viewData = useSpotlightAppStore.getState().viewData
    const prevActionValue = options?.parent ? { value: viewData?.context } : getPrevActionValue(actionId)?.selection

    mog('PRE ACTIION VALUE', { prevActionValue })

    // * if we have a cache, return the cached result
    // if (!fetch) {
    //   const cache = getCachedAction(actionId)
    //   if (cache?.data) return { ...cache?.data, value: cache?.value }
    // }

    if (!actionConfig) return

    setIsLoading(true)

    let auth

    try {
      auth = await actionPerformer?.getAuth(actionConfig?.authTypeId)
    } catch (err) {
      mog('AUTH ERROR', { err })
    }

    // * Get Auth Config from local storage or else call API
    const serviceType = actionConfig?.authTypeId?.split('_')?.[0]?.toLowerCase()
    const configVal = options?.formData
      ? { ...prevActionValue?.value, formData: options.formData }
      : prevActionValue?.value

    try {
      // * if we have a previous action selection, use that
      const result = await actionPerformer?.request({
        config: actionConfig,
        auth,
        configVal,
        serviceType
      })

      addResultInCache(actionId, getIndexedResult(result))

      const resultAction = actionConfig?.postAction?.result
      const isRunAction = resultAction?.type === ClickPostActionType.RUN_ACTION

      // * If there's a result action of type RUN_ACTION,
      if (isRunAction) {
        const postAction = await actionPerformer?.request({
          config: groupedAction?.[actionGroupId]?.[resultAction?.actionId],
          auth,
          configVal: result?.contextData,
          serviceType
        })

        // * View the result action
        setView('item')
        setViewData({ context: result?.contextData, display: postAction?.displayData ?? [] })

        goTo('/action/view', NavigationType.replace)
      }

      setIsLoading(false)

      return result
    } catch (err) {
      mog('Something went wrong', { err })
      setIsLoading(false)
    }

    return undefined
  }

  const initActionPerfomerClient = (workspaceId: string) => {
    mog('WORKSPACE ID', { workspaceId })
    if (workspaceId) actionPerformer.setWorkspaceId(workspaceId)
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

  const getConfig = (actionGroupId: string, actionId: string): ActionHelperConfig =>
    groupedAction?.[actionGroupId]?.[actionId]

  const getConfigWithActionId = (actionId: string) => {
    const actionGroupId = useActionStore.getState().activeAction?.actionGroupId

    return getConfig(actionGroupId, actionId)
  }

  return {
    isPerformer,
    performer,
    initActionPerfomerClient,
    isReady,
    getConfigWithActionId,
    getConfig
  }
}
