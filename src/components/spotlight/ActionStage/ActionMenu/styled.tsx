import { transparentize } from 'polished'
import { animated } from 'react-spring'
import styled from 'styled-components'

export const StyledDefault = styled.div`
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.9rem;
`

export const StyledMenuItem = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.colors.background.card};
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.medium};
  border-radius: ${(props) => props.theme.borderRadius.small};
  align-items: center;
  font-size: 0.8rem;
  gap: 0 0.9rem;
  width: 100%;
  color: ${({ theme }) => theme.colors.text.default};
  box-sizing: border-box;
  justify-content: space-between;
`

export const StyledMenuItems = styled.div`
  flex: 1;
  margin: 0.5rem 0;
`

export const StyledActionMenu = styled(animated.div)`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  z-index: 1;

  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => transparentize(0.2, theme.colors.background.app)};
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.small};
  min-height: 82vh;
`
