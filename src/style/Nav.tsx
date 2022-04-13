import { NavLink } from 'react-router-dom'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { CollapseWrapper } from '../ui/layout/Collapse/Collapse.style'
import { focusStyles } from './focus'
import { FocusModeProp } from './props'

export const NavTitle = styled.span`
  flex-grow: 1;
  transition: opacity 0.2s ease-in-out;
`

export const navTooltip = css`
  .nav-tooltip {
    color: ${({ theme }) => theme.colors.text.oppositePrimary} !important;
    background: ${({ theme }) => theme.colors.primary} !important;
    &::after {
      border-right-color: ${({ theme }) => theme.colors.primary} !important;
    }
  }
`

export const Count = styled.span`
  color: ${({ theme }) => theme.colors.text.fade};
`

const ButtonOrLinkStyles = css`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.medium};
  text-decoration: none !important;
  cursor: pointer;

  font-size: 18px;

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[10]};
    color: ${({ theme }) => theme.colors.text.heading};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const Link = styled(NavLink)`
  ${ButtonOrLinkStyles}

  &.active {
    background-color: ${({ theme }) => theme.colors.gray[9]};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const MainLinkContainer = styled.div`
  width: 100%;
  margin: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const EndLinkContainer = styled.div`
  width: 100%;
  margin: 2rem 0 1rem;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

export const ComingSoon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.small};

  margin-top: ${({ theme }) => theme.spacing.medium};
  &:first-child {
    margin-top: 0;
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }
`

export const NavLogoWrapper = styled.div``
// export const NavLogoWrapper = styled.div``

export const NavButton = styled.div<{ primary?: boolean }>`
  ${ButtonOrLinkStyles}

  ${({ theme, primary }) =>
    primary &&
    css`
      color: ${theme.colors.text.oppositePrimary};
      background-color: ${theme.colors.primary};
      transition: all 0.25s ease-in-out;

      svg {
        color: ${theme.colors.text.oppositePrimary};
      }

      &:hover {
        background-color: ${theme.colors.text.oppositePrimary};
        color: ${theme.colors.primary};

        svg {
          color: ${theme.colors.primary};
        }
      }
    `}
`

export interface NavWrapperProps extends FocusModeProp {
  expanded: boolean
}

export const NavWrapper = styled(animated.div)<NavWrapperProps>`
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 1rem;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100%;
  position: fixed;
  transition: opacity 0.3s ease-in-out;
  padding: 1rem ${({ theme }) => theme.spacing.small} 0;
  gap: ${({ theme }) => theme.spacing.small};

  ${CollapseWrapper} {
    width: 100%;
    transition: opacity 0.2s ease-in-out;
  }

  #Collapse_tree {
    flex-shrink: 0;
    flex-grow: 1;
  }

  ${(props) => focusStyles(props)}

  ${({ expanded }) =>
    !expanded &&
    css`
      ${NavTitle} {
        opacity: 0;
      }

      ${Link}, ${NavButton} {
        padding: 0.75rem;
      }

      ${CollapseWrapper} {
        pointer-events: none;
        opacity: 0;
      }
    `}
`
