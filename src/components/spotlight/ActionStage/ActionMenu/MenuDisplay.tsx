import React from 'react'

import MenuItem from './MenuItem'
import { useActionMenuStore } from './useActionMenuStore'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import MenuActionForm from './MenuActionForm'
import VirtualList from './VirtualList'
import { useMenuPerformer } from './useMenuPerfomer'

export type MenuDisplayProps = {
  menuItems: Array<MenuPostActionConfig>
}

const ActionMenuItems: React.FC<MenuDisplayProps> = ({ menuItems }) => {
  const { runAction } = useMenuPerformer()

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
