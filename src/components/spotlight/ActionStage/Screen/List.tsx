import React from 'react'
import styled, { useTheme } from 'styled-components'
import Row from './Row'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { NotFoundText } from '../../../../style/Form'
import { Icon } from '@iconify/react'

export const FullWidth = styled.div`
  width: 100%;
  height: 420px;
  overflow-y: auto;
  margin-top: 0.5rem;
`

type ListProps = {
  items: Array<any>
  onSelect: (index: number) => void
}

const List: React.FC<ListProps> = ({ items, onSelect }) => {
  const theme = useTheme()

  if (!items || items.length === 0) {
    return (
      <FullWidth>
        <NotFoundText>
          <Icon color={theme.colors.primary} fontSize={48} icon={LensIcon} />
          <p>No results!</p>
        </NotFoundText>
      </FullWidth>
    )
  }

  return (
    <FullWidth>
      {items.map((item, index) => {
        return <Row row={item} key={`TEMPLATE_${index}`} onClick={() => onSelect(index)} />
      })}
    </FullWidth>
  )
}

export default List
