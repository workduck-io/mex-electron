import { CategoryType, useSpotlightContext } from '../../../../store/Context/context.spotlight'
import { Description, StyledRow } from '../../SearchResults/styled'
import { ListItemType } from '../../SearchResults/types'
import styled, { css, useTheme } from 'styled-components'

import { Icon } from '@iconify/react'
import { PrimaryText } from '../../../../style/Integration'
import React from 'react'
import { cleanString } from '../../../../data/Defaults/idPrefixes'
import { QuickLinkType } from '../../../mex/NodeSelect/NodeSelect'
import { ItemShortcutContainer, RowTitle } from './styled'
import { BodyFont } from '@style/spotlight/global'
import { getIconType, ProjectIconMex } from '@components/spotlight/ActionStage/Project/ProjectIcon'
import { DisplayShortcut } from '@workduck-io/mex-components'

export const ActionIcon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.75rem;

  img {
    height: 2rem;
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
    ${BodyFont};
    display: flex;
    align-items: center;
    margin-left: 4px;
    color: ${({ theme }) => theme.colors.text.fade};
  }
`

type ItemProps = { item: ListItemType; active?: boolean; onClick?: () => void }

const Item: React.FC<ItemProps> = ({ item, active, onClick }) => {
  const theme = useTheme()
  const { search, selection, activeItem } = useSpotlightContext()

  const newNodeName = cleanString(search.type === CategoryType.backlink ? search.value.slice(2) : search.value)
  const { mexIcon } = getIconType(item?.icon ?? 'codicon:circle-filled')

  return (
    <StyledRow background={active} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Dot active={active ? 'true' : ''} />
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '1rem' }}>
          <ProjectIconMex
            isMex={mexIcon}
            color={theme.colors.primary}
            size={18}
            icon={item?.icon}
            margin="0 0.75rem 0 0"
          />
          <div style={{ maxWidth: '200px' }}>
            <RowTitle>
              {item?.extras?.new ? (
                <>
                  Create a <PrimaryText>{search.value && !activeItem.active ? newNodeName : 'Quick note'}</PrimaryText>
                </>
              ) : (
                <>{item?.type === QuickLinkType.backlink ? cleanString(item?.title) : item?.title}</>
              )}
            </RowTitle>
            <Description>{item?.description ?? 'some content'}</Description>
          </div>
        </div>
      </div>
      {active && item.shortcut && (
        <ItemShortcutContainer>
          {Object.entries(item.shortcut).map(([key, shortcut]) => {
            if (item.type === QuickLinkType.backlink && key === 'save') {
              if (!selection) return <span key={key}></span>
            }

            return (
              <ShortcutText key={shortcut.title}>
                <DisplayShortcut shortcut={shortcut.keystrokes} /> <div className="text">{shortcut.title}</div>
              </ShortcutText>
            )
          })}
        </ItemShortcutContainer>
      )}
    </StyledRow>
  )
}

export default Item
