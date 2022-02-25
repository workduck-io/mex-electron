import { CategoryType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { Description, StyledRow } from '../../SearchResults/styled'
import { ItemActionType, ListItemType } from '../../SearchResults/types'
import styled, { css, useTheme } from 'styled-components'

import { Icon } from '@iconify/react'
import { PrimaryText } from '../../../../style/Integration'
import React from 'react'
import { StyledKey } from '../../Shortcuts/styled'
import { cleanString } from '../../../../data/Defaults/idPrefixes'

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

export const Dot = styled.span<{ active: string }>`
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

const ShortcutText = styled.div`
  display: flex;
  align-content: center;
  margin: 4px 0;
  div {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.colors.text.fade};
  }
`

function Item({ item, active, onClick }: { item: ListItemType; active?: boolean; onClick?: () => void }) {
  const theme = useTheme()
  const { search, selection, activeItem } = useSpotlightContext()

  const newNodeName = cleanString(search.type === CategoryType.quicklink ? search.value.slice(2) : search.value)

  return (
    <StyledRow showColor={active} onClick={onClick} key={`STRING_${item?.title}`}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dot active={active ? 'true' : ''} />
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
          <Icon
            color={theme.colors.primary}
            style={{ marginRight: '0.75rem' }}
            height={18}
            width={18}
            icon={item?.icon}
          />
          <div style={{ whiteSpace: 'nowrap', maxWidth: '200px', textOverflow: 'ellipsis', overflowX: 'hidden' }}>
            {item?.extras?.new ? (
              <div>
                Create a <PrimaryText>{search.value && !activeItem.active ? newNodeName : 'Quick note'}</PrimaryText>
              </div>
            ) : (
              <div>{item?.type === ItemActionType.ilink ? cleanString(item?.title) : item?.title}</div>
            )}
            <Description>{item?.description ?? 'some content'}</Description>
          </div>
        </div>
      </div>
      {active && item?.type === ItemActionType.ilink && (
        <div style={{ margin: '0 0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <ShortcutText>
            <StyledKey>Tab</StyledKey> <div>to edit</div>
          </ShortcutText>
          {item?.extras?.new ? (
            selection && (
              <ShortcutText>
                <StyledKey>Enter</StyledKey> <div>to save</div>
              </ShortcutText>
            )
          ) : (
            <ShortcutText>
              <StyledKey>Enter</StyledKey> <div>{`${selection ? 'to save' : 'to open'}`}</div>
            </ShortcutText>
          )}
        </div>
      )}
    </StyledRow>
  )
}

export default Item
