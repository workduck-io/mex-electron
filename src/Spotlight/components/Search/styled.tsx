import styled from 'styled-components'
import { Draggable } from '../Actions/styled'
import { StyledBackground } from '../Spotlight/styled'

export const StyledInput = styled.input`
  ${StyledBackground}
  font-size: 1rem;
  border-radius: 10px;
  padding: 10px;
  flex: 1;
  border: none;
  color: #333;
  :focus {
    outline: none;
  }
`

export const StyledSearch = styled.section`
  ${Draggable}
  ${StyledBackground}
  padding: 5px;
  display: flex;
  border-radius: 10px;
`
