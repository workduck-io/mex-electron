import { useActionPerformer } from '@components/spotlight/Actions/useActionPerformer'
import { useActionStore } from '@components/spotlight/Actions/useActionStore'
import { MexIcon } from '@style/Layouts'
import { MenuPostActionConfig } from '@workduck-io/action-request-helper'
import { DisplayShortcut } from '@workduck-io/mex-components'
import React, { useEffect, useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { ShortcutText } from '../../Home/components/Item'
import { StyledMenuItem } from './styled'

export type MenuItemProps = {
  item: MenuPostActionConfig
  highlight?: boolean
  isActive?: boolean
  onClick?: (item: any) => void
}

const FlexCenter = styled.div`
  display: flex;
  align-items: center;
`

const MenuItem: React.FC<MenuItemProps> = ({ item, highlight, isActive, onClick }) => {
  const theme = useTheme()
  const ref = useRef(null)
  const { getConfig } = useActionPerformer()
  const activeAction = useActionStore((store) => store.activeAction)

  const getMenuTitle = (actionId: string) => {
    const actionGroupId = activeAction?.actionGroupId
    const config = getConfig(actionGroupId, actionId)

    return config?.name
  }

  useEffect(() => {
    ref?.current?.focus()
  }, [])

  const handleOnClick = (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
    onClick(item)
  }

  return (
    <StyledMenuItem ref={ref} onClick={handleOnClick} highlight={highlight}>
      <FlexCenter>
        <MexIcon icon={item?.icon} margin="0 0.5rem 0 0" height="1rem" width="1rem" color={theme.colors.primary} />
        <div>{getMenuTitle(item.actionId) || item.label}</div>
      </FlexCenter>
      <ShortcutText key={item.actionId}>
        <DisplayShortcut shortcut={item.shortcut} />
      </ShortcutText>
    </StyledMenuItem>
  )
}

export default MenuItem
