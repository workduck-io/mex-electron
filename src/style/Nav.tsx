import { transparentize } from 'polished'
import { NavLink } from 'react-router-dom'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { Ellipsis } from '../components/mex/Integrations/Template/styled'
import { CollapseHeader, CollapseWrapper } from '../ui/layout/Collapse/Collapse.style'
import { focusStyles } from './focus'
import { FocusModeProp } from './props'

export const NavTitle = styled.span`
  flex-grow: 1;
  flex-shrink: 0;
  transition: opacity 0.2s ease-in-out;
  ${Ellipsis}
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
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.default};
  padding: 6px 12px;
  text-decoration: none !important;
  cursor: pointer;
  font-weight: bold;
  width: 100%;

  font-size: 14px;

  svg {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
    color: ${({ theme }) => theme.colors.text.heading};
  }

  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const Link = styled(NavLink)`
  ${ButtonOrLinkStyles}

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.oppositePrimary};
    svg,
    ${Count} {
      color: ${({ theme }) => theme.colors.text.oppositePrimary};
    }
  }
`

export const NavDivider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray[6]};
  margin: ${({ theme }) => theme.spacing.small} 0;
`

export const MainLinkContainer = styled.div`
  width: 100%;
  margin: 1rem 0;
  padding: ${({ theme }) => theme.spacing.small};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`

export const EndLinkContainer = styled.div`
  border-top: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;
  margin: 1rem 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const NavLogoWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
  padding: ${({ theme }) => theme.spacing.small};
  padding-left: 5rem;
  transition: padding 0.5s ease;
`

export const CreateNewButton = styled.div`
  ${ButtonOrLinkStyles}
  border: 1px solid ${({ theme }) => theme.colors.primary};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.heading};
`

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

    &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[6]};
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 10px;
    min-height: 32px;
  }
`

export interface NavWrapperProps extends FocusModeProp {
  expanded: boolean
}

export const NavWrapper = styled(animated.div)<NavWrapperProps>`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100%;
  transition: opacity 0.3s ease-in-out;
  padding: 0 0;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  gap: ${({ theme }) => theme.spacing.small};
  user-select: none;

  ${CollapseWrapper} {
    width: 100%;
    transition: opacity 0.2s ease-in-out, height 0.2s ease-in-out;
    padding: 0 0 0 ${({ theme }) => theme.spacing.small};
    ${CollapseHeader} {
      padding-right: 0.5rem;
    }
  }

  #Collapse_tree {
    flex-shrink: 0;
    flex-grow: 1;
  }

  ${(props) => focusStyles(props)}

  ${({ expanded, theme }) =>
    !expanded &&
    css`
      ${NavTitle}, ${Count} {
        display: none;
      }

      ${Link}, ${NavButton}, ${CreateNewButton} {
        padding: 12px;
        width: 48px;
        transition-delay: 0.8s;
        transition: width 0.8s ease-in-out;
      }

      ${MainLinkContainer}, ${EndLinkContainer} {
      }

      ${EndLinkContainer} {
        margin-top: auto;
      }

      ${NavLogoWrapper} {
        padding: 0px 22px 16px;
        padding-top: ${({ theme }) => (theme.additional.hasBlocks ? 8 : 28)}px;
      }

      ${CollapseWrapper} {
        pointer-events: none;
        cursor: default;
        max-height: 64px;
        opacity: 0;
        div {
          pointer-events: none !important;
        }
      }
    `}

    &::-webkit-scrollbar-thumb, *::-webkit-scrollbar-thumb {
    background: ${({ theme }) => transparentize(0.5, theme.colors.gray[6])};
    border-radius: 6px;
    border: 2px solid rgba(0, 0, 0, 0);
    background-clip: content-box;
    min-width: 10px;
    min-height: 32px;
  }
`
