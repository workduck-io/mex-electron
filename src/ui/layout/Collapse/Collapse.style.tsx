import { animated } from 'react-spring'
import styled, { css } from 'styled-components'

export const CollapseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const CollapsableHeaderTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  font-size: 1.25rem;
  font-weight: bolder;
  flex-grow: 1;
  svg.SidebarCollapseSectionIcon {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const CollapseToggle = styled.div`
  svg {
    padding: ${({ theme }) => theme.spacing.tiny};
    border-radius: ${({ theme }) => theme.borderRadius.tiny};
    color: ${({ theme }) => theme.colors.text.fade};
    height: 28px;
    width: 28px;
  }
`

export const CollapseHeader = styled.div<{ collapsed?: boolean; canClick?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  user-select: none;

  gap: ${({ theme }) => theme.spacing.tiny};

  ${({ canClick }) =>
    canClick &&
    css`
      cursor: pointer;
    `}

  :hover {
    ${CollapseToggle} {
      svg {
        background-color: ${({ theme }) => theme.colors.gray[8]};
      }
    }
  }

  ${({ collapsed }) =>
    collapsed &&
    css`
      ${CollapseToggle} {
        svg {
          color: ${({ theme }) => theme.colors.text.fade};
        }
      }
    `}
`

export const CollapseContent = styled(animated.div)`
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
`
