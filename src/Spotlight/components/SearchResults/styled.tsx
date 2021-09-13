import styled from 'styled-components'
import { ColorProp, ColumnContainer } from '../Actions/styled'
import { StyledBackground } from '../Spotlight/styled'

export const StyledResults = styled(ColumnContainer)`
  flex: 4;
  margin-top: 4px;
  :focus {
    outline: none;
  }
`

export const StyledRow = styled.div<ColorProp>`
  ${({ showColor }) => showColor && StyledBackground}
  padding: 10px 1rem;
  margin: 5px 0;
  color: ${({ theme }) => theme.colors.text.fade};
  border-radius: 10px;
`

export const Description = styled.p`
  margin: 4px 0;
  font-size: 10px;
  font-weight: lighter;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

export const Heading = styled.div`
  font-size: 1.1rem;
  margin: 5px 0 5px;
  font-weight: lighter;
  color: ${({ theme }) => theme.colors.text.fade};
`
