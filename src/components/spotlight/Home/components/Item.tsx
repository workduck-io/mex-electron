import React from 'react'
import styled, { useTheme } from 'styled-components'
import { StyledRow, Description } from '../../SearchResults/styled'
import { MexitAction } from '../actionExecutor'
import { Icon } from '@iconify/react'
import { StyledKey } from '../../Shortcuts/styled'

const ActionIcon = styled.div`
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

function Item({ item, active, onClick }: { item: MexitAction; active?: boolean; onClick?: () => void }) {
  const theme = useTheme()
  return (
    <StyledRow showColor={active} onClick={onClick} key={`STRING_${item.title}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {item.data.icon ? (
          <ActionIcon>{item.data.icon && <img src={`./assets/${item.data.icon}`} />}</ActionIcon>
        ) : (
          <Icon
            color={theme.colors.primary}
            style={{ marginRight: '8px' }}
            height={24}
            width={24}
            icon={item.icon ?? 'gg:file-document'}
          />
        )}
        <div>{item?.title}</div>
        <Description>{item?.description}</Description>
      </div>
      {active && (
        <Shortcut>
          {item.shortcut && item.shortcut.map((shortcutKey, id) => <StyledKey key={id}>{shortcutKey}</StyledKey>)}
        </Shortcut>
      )}
    </StyledRow>
  )
}

export default Item
