import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import React from 'react'
import { DisplayShortcut } from '../../../mex/Shortcuts'
import { ShortcutText } from '../../Home/components/Item'
import { StyledMenuItem } from './styled'

export type MenuItemProps = {
  item: MenuPostActionConfig
  highlight?: boolean
  isActive?: boolean
}

const MenuItem: React.FC<MenuItemProps> = ({ item, highlight, isActive }) => {
  const { getConfig } = useActionPerformer()
  const activeAction = useActionStore((store) => store.activeAction)
  const getMenuTitle = (actionId: string) => {
    const actionGroupId = activeAction?.actionGroupId
    const config = getConfig(actionGroupId, actionId)

    return config?.name
  }

  const handleOnClick = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
  }

  return (
    <StyledMenuItem onClick={handleOnClick} highlight={highlight}>
      <div>{getMenuTitle(item.actionId)}</div>
      <ShortcutText key={item.actionId}>
        <DisplayShortcut shortcut={item.shortcut} />
      </ShortcutText>
    </StyledMenuItem>
  )
}

export default MenuItem
