import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import React from 'react'
import { DisplayShortcut } from '../../../mex/Shortcuts'
import { ShortcutText } from '../../Home/components/Item'
import { StyledMenuItem } from './styled'

export type MenuItemProps = {
  item: MenuPostActionConfig
  title: string
}

const MenuItem: React.FC<MenuItemProps> = ({ item, title }) => {
  return (
    <StyledMenuItem>
      <div>{title}</div>
      <ShortcutText key={item.actionId}>
        <DisplayShortcut shortcut={item.shortcut} />
      </ShortcutText>
    </StyledMenuItem>
  )
}

export default MenuItem
