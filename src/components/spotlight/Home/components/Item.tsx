import React from 'react'
import styled, { useTheme } from 'styled-components'
import { StyledRow, Description } from '../../SearchResults/styled'
import { Icon } from '@iconify/react'
import { StyledKey } from '../../Shortcuts/styled'
import { ListItemType } from '../../SearchResults/types'

export const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;
  img {
    height: 24px;
    aspect-ratio: 1/1;
  }
`

export const Shortcut = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem;
`

function Item({ item, active, onClick }: { item: ListItemType; active?: boolean; onClick?: () => void }) {
  const theme = useTheme()
  return (
    <StyledRow showColor={active} onClick={onClick} key={`STRING_${item?.title}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon color={theme.colors.primary} style={{ marginRight: '8px' }} height={18} width={18} icon={item?.icon} />
          <div>{item?.title}</div>
        </div>
        <Description>{item?.description}</Description>
      </div>
      {active && (
        <Shortcut>
          {item?.shortcut && item?.shortcut?.map((shortcutKey, id) => <StyledKey key={id}>{shortcutKey}</StyledKey>)}
        </Shortcut>
      )}
    </StyledRow>
  )
}

export default Item
