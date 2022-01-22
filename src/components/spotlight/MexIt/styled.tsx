import styled from 'styled-components'
import { Draggable } from '../Actions/styled'
import { Heading } from '../SearchResults/styled'

export const StyledEditor = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 0.8rem;
  margin-top: 5px;
  border-radius: 5px;
  overflow-y: auto;
  max-height: 324px;
  background-color: ${({ theme }) => theme.colors.background.modal};
`

export const FullEditor = styled.div`
  width: 100%;
`

export const StyledHeader = styled.section`
  ${Draggable}
  padding: 5px 2px;
  font-weight: 600;
  display: flex;
  border-radius: 10px;
`

export const StyledHeading = styled(Heading)`
  flex: 1;
`