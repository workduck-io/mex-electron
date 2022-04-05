import { CategoryType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { Description, StyledRow } from '../../SearchResults/styled'
import { ListItemType } from '../../SearchResults/types'
import styled, { css, useTheme } from 'styled-components'

import { DisplayShortcut } from '../../../mex/Shortcuts'
import { Icon } from '@iconify/react'
import { PrimaryText } from '../../../../style/Integration'
import React from 'react'
import { cleanString } from '../../../../data/Defaults/idPrefixes'
import { QuickLinkType } from '../../../mex/NodeSelect/NodeSelect'
import { mog } from '../../../../utils/lib/helper'

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

export const ShortcutText = styled.div`
  margin-bottom: 2px;
  display: flex;
  justify-content: flex-end;

  .text {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.text.fade};
  }
`

type ItemProps = { item: ListItemType; active?: boolean; onClick?: () => void }

const Item: React.FC<ItemProps> = ({ item, active, onClick }) => {
  const theme = useTheme()
  const { search, selection, activeItem } = useSpotlightContext()

  const newNodeName = cleanString(search.type === CategoryType.quicklink ? search.value.slice(2) : search.value)

  return (
    <StyledRow showColor={active} onClick={onClick}>
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
          <div style={{ maxWidth: '200px' }}>
            <div style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflowX: 'hidden' }}>
              {item?.extras?.new ? (
                <>
                  Create a <PrimaryText>{search.value && !activeItem.active ? newNodeName : 'Quick note'}</PrimaryText>
                </>
              ) : (
                <>{item?.type === QuickLinkType.ilink ? cleanString(item?.title) : item?.title}</>
              )}
            </div>
            <Description>{item?.description ?? 'some content'}</Description>
          </div>
        </div>
      </div>
      {active && item.shortcut && (
        <div
          style={{
            margin: '0 0.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {Object.entries(item.shortcut).map(([key, shortcut]) => {
            if (item.type === QuickLinkType.ilink && key === 'save') {
              if (!selection) return <></>
            }

            return (
              <ShortcutText key={shortcut.title}>
                <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
              </ShortcutText>
            )
          })}
        </div>
      )}
    </StyledRow>
  )
}

export default Item
