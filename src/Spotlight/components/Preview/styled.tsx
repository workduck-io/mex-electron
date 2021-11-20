import styled from 'styled-components'
import { Scroll } from '../../../Spotlight/styles/layout'
import { Draggable } from '../Actions/styled'
import { StyledBackground } from '../Spotlight/styled'

export const StyledPreview = styled.div`
  ${StyledBackground}
  ${Draggable}
  ${Scroll}
position: relative;
  padding: 1rem;
  flex: 5;
  border-radius: 1rem;
  white-space: pre-wrap;
`

export const StyledEditorPreview = styled.div`
  /* ${Scroll} */
`

export const SeePreview = styled.div`
  position: fixed;
  right: 44%;
  cursor: pointer;
  z-index: 3000;
  display: flex;
  padding: 5px;
  border-radius: 50%;
  border: none;
  color: ${({ theme }) => theme.colors.text.fade};
  box-shadow: 0px 2px 4px ${({ theme }) => theme.colors.background.modal};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  bottom: 3.1rem;
`
