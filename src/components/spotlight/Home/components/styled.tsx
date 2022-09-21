import { MainFont } from '@style/spotlight/global'
import styled from 'styled-components'

export const ItemShortcutContainer = styled.div`
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const RowTitle = styled.div`
  ${MainFont};
  gap: 0.25rem;
  display: flex;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow-x: hidden;
`
