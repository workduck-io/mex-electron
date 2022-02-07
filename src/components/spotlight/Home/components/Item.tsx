import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import { StyledRow, Description } from '../../SearchResults/styled'
import { Icon } from '@iconify/react'
import { StyledKey } from '../../Shortcuts/styled'
import { ListItemType } from '../../SearchResults/types'
import { NoWrap, PrimaryText } from '../../../../style/Integration'
import { useSpotlightContext } from '../../../../store/Context/context.spotlight'

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

export const Dot = styled.span<{ active: boolean }>`
  /* padding: 2px; */
  height: 5px;
  width: 5px;
  border-radius: 50%;
  margin: 0 0.75rem 0 0.5rem;
  ${({ active }) =>
    active &&
    css`
      background-color: ${({ theme }) => theme.colors.secondary};
    `};
`

function Item({ item, active, onClick }: { item: ListItemType; active?: boolean; onClick?: () => void }) {
  const theme = useTheme()
  const { search } = useSpotlightContext()
  return (
    <StyledRow showColor={active} onClick={onClick} key={`STRING_${item?.title}`}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Dot active={active} />
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
            <Icon
              color={theme.colors.primary}
              style={{ marginRight: '0.75rem' }}
              height={18}
              width={18}
              icon={item?.icon}
            />
            <div style={{ whiteSpace: 'nowrap' }}>
              {item?.extras?.new ? (
                <div>
                  Create new <PrimaryText>{search.value.slice(2)}</PrimaryText>
                </div>
              ) : (
                <div>{item?.title}</div>
              )}
            </div>
          </div>
          <Description>{item?.description}</Description>
        </div>
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
