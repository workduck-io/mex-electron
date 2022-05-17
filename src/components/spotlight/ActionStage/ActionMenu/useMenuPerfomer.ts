/* eslint-disable no-case-declarations */
import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import useItemExecutor from '@components/spotlight/Home/actionExecutor'
import { getListItemFromAction } from '@components/spotlight/Home/helper'
import { IpcAction } from '@data/IpcAction'
import { appNotifierWindow } from '@electron/utils/notifiers'
import { AppType } from '@hooks/useInitialize'
import { useSpotlightAppStore, ViewDataType } from '@store/app.spotlight'
import { mog } from '@utils/lib/helper'
import { ClickPostActionType, MenuPostActionConfig } from '@workduck-io/action-request-helper'
import useActionMenuStore from './useActionMenuStore'

export const useMenuPerformer = () => {
  const { getConfigWithActionId } = useActionPerformer()
  const clearMenu = useActionMenuStore((store) => store.clearMenuStore)
  const addSelectionInCache = useActionStore((store) => store.addSelectionInCache)
  const getPreviousActionValue = useActionStore((store) => store.getPrevActionValue)
  const setActiveMenuAction = useActionMenuStore((store) => store.setActiveMenuAction)
  const setNeedsRefresh = useActionMenuStore((store) => store.setNeedsRefresh)

  const { itemActionExecutor } = useItemExecutor()

  const actionRunner = (menuAction: MenuPostActionConfig, actionInfo: ViewDataType) => {
    switch (menuAction.type) {
      case ClickPostActionType.COPY_ACTION:
        const text = actionInfo.display.find((d) => d.key === menuAction.key)?.value
        const title = menuAction.label.replace('Copy', 'Copied')
        appNotifierWindow(IpcAction.COPY_TO_CLIPBOARD, AppType.SPOTLIGHT, { text, html: text, title })

        break
      case ClickPostActionType.OPEN_URL:
        const url = actionInfo?.display?.find((item) => item.type === 'url')?.value as string
        if (url) {
          clearMenu()
          window.open(url, '_blank')
        }
        break
      case ClickPostActionType.REFRESH_ACTION:
        clearMenu()
        setNeedsRefresh()
        break
      case ClickPostActionType.RUN_ACTION:
        performAction(menuAction)
        break
      case ClickPostActionType.VIEW_DATA:
        break
      default:
        mog("Can't find this action type")
    }
  }

  const performAction = async (item: MenuPostActionConfig) => {
    const actionDetails = getConfigWithActionId(item.actionId)

    if (!actionDetails.form) {
      const activeAction = useActionStore.getState().activeAction
      const actionGroups = useActionStore.getState().actionGroups
      const selection = getPreviousActionValue(activeAction?.id)?.selection

      const viewData = useSpotlightAppStore.getState().viewData
      const prev = selection?.label

      const currentLabel = viewData?.context?.select?.label
      const val = {
        prev,
        selection: {
          label: currentLabel,
          value: viewData?.context
        }
      }

      addSelectionInCache(activeAction?.id, val)

      const actionItem = getListItemFromAction(actionDetails, actionGroups[actionDetails?.actionGroupId])

      itemActionExecutor(actionItem)
    } else {
      setActiveActionMenuItem(item)
    }
  }

  const runAction = (item: MenuPostActionConfig) => {
    const viewData = useSpotlightAppStore.getState().viewData

    actionRunner(item, viewData)
  }

  const setActiveActionMenuItem = (item: MenuPostActionConfig) => {
    setActiveMenuAction(item)
  }

  return {
    runAction,
    setActiveActionMenuItem
  }
}