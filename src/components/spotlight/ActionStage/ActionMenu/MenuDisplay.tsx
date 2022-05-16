import React from 'react'

import MenuItem from './MenuItem'
import useActionMenuStore from './useActionMenuStore'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import MenuActionForm from './MenuActionForm'
import VirtualList from './VirtualList'

export type MenuDisplayProps = {
  menuItems: Array<MenuPostActionConfig>
}

const ActionMenuItems: React.FC<MenuDisplayProps> = ({ menuItems }) => {
  const setActiveMenuAction = useActionMenuStore((store) => store.setActiveMenuAction)

  const setActive = (item: MenuPostActionConfig) => {
    setActiveMenuAction(item)
  }

  return <VirtualList items={menuItems} onEnter={setActive} onClick={setActive} ItemRenderer={MenuItem} />
}

const MenuDisplay: React.FC<MenuDisplayProps> = ({ menuItems }) => {
  const activeMenuAction = useActionMenuStore((store) => store.activeMenuAction)

  if (activeMenuAction) {
    return <MenuActionForm action={activeMenuAction} />
  }

  return <ActionMenuItems menuItems={menuItems} />
}

export default MenuDisplay
