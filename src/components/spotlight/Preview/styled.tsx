import { animated } from 'react-spring'
import styled from 'styled-components'
import { Scroll } from '../../../style/spotlight/layout'
import { StyledBackground } from '../Spotlight/styled'

export const StyledPreview = styled(animated.div)`
  ${StyledBackground}
  ${Scroll}
  position: relative;
  padding: 0.5rem;
  border-radius: 1rem;
  white-space: pre-wrap;
  width: 100%;
`

export const StyledEditorPreview = styled.div`
  /* ${Scroll} */
`

export const SeePreview = styled.div`
  position: fixed;
  right: 1.2rem;
  cursor: pointer;
  z-index: 3000;
  display: flex;
  padding: 5px;
  border-radius: 50%;
  border: none;
  color: ${({ theme }) => theme.colors.text.fade};
  box-shadow: 0px 2px 4px ${({ theme }) => theme.colors.background.modal};
  background-color: ${({ theme }) => theme.colors.background.highlight};
  bottom: 1.8rem;
`
