import { getPlateEditorRef, findNodePath, setNodes } from '@udecode/plate'
import { mog } from '@utils/lib/mog'
import { useReadOnly } from 'slate-react'

import {
  ActionHelperClient,
  ActionHelperConfig,
  ActionHelperConfigValues,
  ActionResponse,
  ClickPostActionType,
  ReturnType
} from '@workduck-io/action-request-helper'


import { ACTION_ENV } from '../../../apis/routes'
import { useActionMenuStore } from '../ActionStage/ActionMenu/useActionMenuStore'
import { UpdateActionsType, useActionStore } from './useActionStore'
import { useActionsCache } from './useActionsCache'
import { API } from '../../../../src/API'


type PerfomerOptions = {
  formData?: Record<string, any>
  fetch?: boolean
  parent?: boolean
  storeInEditor?: boolean
}

export const getActionCacheKey = (key: string, blockId?: string) => {
  const hashKey = blockId ? `${blockId}#${key}` : key

  return hashKey
}


export const getIndexedResult = (res: ActionResponse) => {
  const d: ActionResponse = {
    ...res,
    displayData: res?.displayData?.map((data, index) => [...data, { key: 'index', type: 'hidden', value: index }])
  }

  return d
}

export const useActionsPerfomerClient = () => {
  const initActionPerfomerClient = (userId: string) => {
    if (userId) API.action.setUserId(userId)
  }

  return {
    initActionPerfomerClient
  }
}

export const useActionPerformer = () => {
  const activeAction = useActionStore((store) => store.activeAction)
  const getPrevActionValue = useActionStore((store) => store.getPrevActionValue)
  const getSelection = useActionStore((store) => store.getSelectionCache)
  const addSelectionInCache = useActionStore((store) => store.addSelectionInCache)
  const setIsLoading = useActionStore((store) => store.setIsLoading)
  const actionToPerform = useActionStore((store) => store.actionToPerform)
  const groupedAction = useActionsCache((store) => store.groupedActions)
  const setView = useActionStore((store) => store.setView)
  const setViewData = useActionStore((store) => store.setViewData)
  const setNeedsRefresh = useActionMenuStore((store) => store.setNeedsRefresh)
  const viewData = useActionStore((store) => store.viewData)
  const element = useActionStore((store) => store.element)
  const initAction = useActionStore((store) => store.initAction)
  const addResultHash = useActionsCache((store) => store.addResultHash)
  const readOnly = useReadOnly()
  const isMenuActionOpen = useActionMenuStore((store) => store.isActionMenuOpen)
  /* 
    Looks for the action in the cache first,
    Performs an actions and return's the result
    if not found, it will perform the action and add it to the cache
  */
  const performer = async (actionGroupId: string, actionId: string, options?: PerfomerOptions) => {
    const actionConfig = groupedAction?.[actionGroupId]?.[actionId]

    let auth
    if (!actionConfig) return
    if (!isMenuActionOpen) setIsLoading(true)

    try {
      auth = await API.action?.getAuth(actionConfig?.authTypeId)
    } catch (err) {
      mog('AUTH ERROR', { err })
    }

    // * Get Auth Config from local storage or else call API
    const serviceType = actionConfig?.actionGroupId?.toLowerCase()
    const configVal = getPerformerContext(actionConfig, options)
    // mog(`${actionId} performer`, { configVal, actionConfig, viewData, auth, prevActionValue, isParentContext })

    try {
      // * if we have a previous action selection, use that
      const result = await API.action?.request({
        config: actionConfig,
        auth,
        configVal,
        serviceType,
        options: {
          forceUpdate: options?.fetch
        }
      })

      addResultInCache(actionId, result?._hash)

      if (options?.fetch) setNeedsRefresh()

      const resultAction = actionConfig?.postAction?.result
      const isRunAction = resultAction?.type === ClickPostActionType.RUN_ACTION

      // * If there's a result action of type RUN_ACTION,
      if (isRunAction) {
        const postContext = result?.contextData || { url: configVal.url }
        const resultActionConfig = groupedAction?.[actionGroupId]?.[resultAction?.actionId]

        const postActionResult = await API.action?.request({
          config: resultActionConfig,
          auth,
          configVal: postContext,
          serviceType,
          options: {
            forceUpdate: true
          }
        })

        if (!isMenuActionOpen && element) {
          saveContext(resultActionConfig, postContext, true)
          initAction(resultActionConfig?.actionGroupId, resultAction?.actionId)
          setView('item')
        } else {
          const display =
            resultActionConfig.returnType === ReturnType.LIST
              ? postActionResult?.displayData?.[0]
              : postActionResult?.displayData

          const viewData = { context: result?.contextData || configVal, display }

          // * View the result action
          if (display) {
            setView('item')
            setViewData(viewData)
          }
        }
      }

      if (!isMenuActionOpen) setIsLoading(false)

      const storeRes: ActionResponse =
        actionConfig?.returnType === ReturnType.OBJECT ? result : getIndexedResult(result)

      if (actionId === activeAction?.id && !isMenuActionOpen && element) {
        insertInEditor(element, { actionDisplayItems: storeRes?.displayData })
      }

      return storeRes
    } catch (err) {
      mog('Unable to perform result action', { err })
      if (!isMenuActionOpen) setIsLoading(false)
    }

    return undefined
  }

  const insertInEditor = (element?: any, data?: Record<string, any>) => {
    const editor = getPlateEditorRef()

    if (editor && !readOnly) {
      const path = findNodePath(editor, element)
      setNodes(editor, data, { at: path })
    }
  }

  const saveContext = (actionConfig: ActionHelperConfig, context: ActionHelperConfigValues, isView?: boolean) => {
    if (element?.actionContext) {
      insertInEditor(element, {
        actionContext: {
          view: isView,
          prevContext: context,
          actionGroupId: actionConfig?.actionGroupId,
          actionId: actionConfig?.actionId
        }
      })
    }
  }

  const getPerformerContext = (config: ActionHelperConfig, options?: PerfomerOptions) => {
    const isParentContext =
      (options?.parent && !config?.preActionId) || (!activeAction?.actionIds && isMenuActionOpen && !options?.parent)

    const editorContext = element?.actionContext?.prevContext

    if (editorContext) return editorContext

    const prevActionValue = isParentContext
      ? { value: viewData?.context }
      : getPrevActionValue(config?.actionId)?.selection

    const configVal = options?.formData
      ? { ...prevActionValue?.value, formData: options.formData }
      : prevActionValue?.value

    return configVal
  }

  const addResultInCache = (actionId: string, hash: string) => {
    const actionHashKey = getActionCacheKey(actionId, element?.id)
    addResultHash(actionHashKey, hash)
    // appNotifierWindow(IpcAction.UPDATE_ACTIONS, AppType.MEX, {
    //   type: UpdateActionsType.UPDATE_HASH,
    //   key: actionHashKey,
    //   hash
    // })

    if (!isMenuActionOpen && activeAction?.subType !== 'form') addSelectionInCache(actionId, undefined)
  }

  const isPerformer = (actionId: string, option?: { isMenuAction?: boolean }) => {
    const selection = getSelection(actionId)
    const prevActionValue = getPrevActionValue(actionId)
    const action = getConfig(activeAction?.actionGroupId, actionId)

    const isNew = prevActionValue === undefined && selection === undefined
    const hasPrevValueChanged = prevActionValue?.selection && selection?.prev !== prevActionValue?.selection?.label

    const hasPreAction = action?.preActionId

    if (isMenuActionOpen) {
      return option?.isMenuAction
    }

    return hasPreAction ? hasPrevValueChanged : isNew
  }

  const isReady = () => {
    return activeAction?.id === actionToPerform
  }

  const getConfig = (actionGroupId: string, actionId: string): ActionHelperConfig =>
    groupedAction?.[actionGroupId]?.[actionId]

  const getConfigWithActionId = (actionId: string) => {
    const actionGroupId = activeAction?.actionGroupId

    return getConfig(actionGroupId, actionId)
  }
  return {
    isPerformer,
    performer,
    isReady,
    insertInEditor,
    getConfigWithActionId,
    getConfig
  }
}
