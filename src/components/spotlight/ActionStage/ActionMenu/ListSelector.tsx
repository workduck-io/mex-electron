import { MexIcon } from '@style/Layouts'
import React, { useRef } from 'react'
import styled, { useTheme } from 'styled-components'
import { StyledOption } from '../Performers/styled'
import { getIconType, ProjectIconMex } from '../Project/ProjectIcon'
import { StyledBackground } from '@components/spotlight/styled'

type ListSelectorProps = {
  item: any
  onClick: (item: any) => void
  isActive?: boolean
  highlight?: boolean
}

const MenuListOption = styled((props) => <StyledOption {...props} />)`
  margin-bottom: ${({ theme }) => theme.spacing.tiny};
  padding: ${({ theme }) => theme.spacing.medium};
  background-color: ${({ theme, highlight }) => highlight && theme.colors.background.app};

  :hover {
    ${StyledBackground}
  }
`

const DEFAULT_LIST_ITEM_ICON = 'codicon:circle-filled'

const ListSelector: React.FC<ListSelectorProps> = ({ item, highlight, isActive }) => {
  const theme = useTheme()
  const { icon, color } = item?.value?.select
  const { mexIcon } = getIconType(icon ?? DEFAULT_LIST_ITEM_ICON)

  return (
    <MenuListOption highlight={highlight} isActive={isActive}>
      <span>
        <ProjectIconMex
          isMex={mexIcon}
          size={16}
          color={color ?? theme.colors.secondary}
          icon={icon ?? DEFAULT_LIST_ITEM_ICON}
        />
      </span>
      <div style={{ flex: 1 }}>{item?.label}</div>
      {isActive && (
        <MexIcon noHover color={theme.colors.primary} icon="bi:check-lg" margin="0 0.5rem" height="1rem" width="1rem" />
      )}
    </MenuListOption>
  )
}

export default ListSelector
