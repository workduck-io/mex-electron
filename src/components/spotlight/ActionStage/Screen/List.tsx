import React from 'react'
import styled, { css, useTheme } from 'styled-components'
import Row from './Row'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { NotFoundText } from '../../../../style/Form'
import { Icon } from '@iconify/react'
import { useActionStore } from '../../Actions/useActionStore'

export const FullWidth = styled.div<{ narrow: boolean }>`
  width: 100%;
  ${({ narrow }) =>
    narrow
      ? css`
          height: calc(84vh - 2.75rem);
        `
      : css`
          height: 84vh;
        `}
  overflow-y: auto;
  overflow-behavior: contain;
  margin-top: 0.5rem;
`

type ListProps = {
  items: Array<any>
  onSelect: (index: number) => void
}

const List: React.FC<ListProps> = ({ items, onSelect }) => {
  const theme = useTheme()
  const activeAction = useActionStore((store) => store.activeAction)

  if (!items || items.length === 0) {
    return (
      <FullWidth narrow={!!activeAction?.actionIds}>
        <NotFoundText>
          <Icon color={theme.colors.primary} fontSize={48} icon={LensIcon} />
          <p>No results!</p>
        </NotFoundText>
      </FullWidth>
    )
  }

  return (
    <FullWidth narrow={!!activeAction?.actionIds}>
      {items.map((item, index) => {
        return <Row row={item} key={`TEMPLATE_${index}`} onClick={() => onSelect(index)} />
      })}
    </FullWidth>
  )
}

export default List
