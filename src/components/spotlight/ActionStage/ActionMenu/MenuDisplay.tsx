import React from 'react'

import MenuItem from './MenuItem'
import useActionMenuStore from './useActionMenuStore'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import MenuActionForm from './MenuActionForm'
import VirtualList from './VirtualList'
import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import useItemExecutor from '@components/spotlight/Home/actionExecutor'
import { getListItemFromAction } from '@components/spotlight/Home/helper'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { mog } from '@utils/lib/helper'
import { useSpotlightAppStore } from '@store/app.spotlight'

export type MenuDisplayProps = {
  menuItems: Array<MenuPostActionConfig>
}

const ActionMenuItems: React.FC<MenuDisplayProps> = ({ menuItems }) => {
  const setActiveMenuAction = useActionMenuStore((store) => store.setActiveMenuAction)
  const addSelectionInCache = useActionStore((store) => store.addSelectionInCache)
  const getPreviousActionValue = useActionStore((store) => store.getPrevActionValue)

  const { getConfigWithActionId } = useActionPerformer()

  const { itemActionExecutor } = useItemExecutor()

  const runAction = async (item: MenuPostActionConfig) => {
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

      mog('VAL', { val, selection })

      addSelectionInCache(activeAction?.id, val)

      const actionItem = getListItemFromAction(actionDetails, actionGroups[actionDetails?.actionGroupId])

      itemActionExecutor(actionItem)
    } else {
      setActive(item)
    }
  }

  const setActive = (item: MenuPostActionConfig) => {
    setActiveMenuAction(item)
  }

  return <VirtualList items={menuItems} onEnter={runAction} onClick={runAction} ItemRenderer={MenuItem} />
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menuItems }) => {
  const activeMenuAction = useActionMenuStore((store) => store.activeMenuAction)

  if (activeMenuAction) {
    return <MenuActionForm action={activeMenuAction} />
  }

  return <ActionMenuItems menuItems={menuItems} />
}

export default MenuDisplay
