import styled from 'styled-components'
import { Draggable } from '../Actions/styled'

export const StyledBubble = styled.div<{ modal?: boolean }>`
  margin: 0.2rem 0.4rem 0.4rem 0rem;
  left: 0;
  top: 0;
  z-index: 1000;
  background-color: ${({ theme }) => theme.colors.background.modal};
  display: ${({ modal }) => (modal ? 'block' : 'none')};
  padding: 0.6rem;
  position: fixed;
  ${Draggable};
`
export const Badge = styled.span`
  position: absolute;
  background-color: #e74f4f;
  padding: 5px;
  border-radius: 50%;
  top: 4px;
  ${Draggable}
  right: 8px;
`
