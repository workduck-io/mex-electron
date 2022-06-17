import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const BList = styled.div`
  /* max-height: 15rem;
  overflow-x: hidden;
  overflow-y: auto; */
  list-style: none;
  height: 100%;
`

// Sidebar Item
// Does not have children
// For children with expand collapse, see StyledTreeItem
export const SItem = styled.div<{ selected: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding-left: ${({ theme }) => theme.spacing.large};
  &:hover {
    transition: 0s ease;
    background: ${({ theme }) => theme.colors.gray[7]};
  }

  ${({ selected, theme }) =>
    selected &&
    css`
      background: ${theme.colors.primary};
      color: ${theme.colors.text.oppositePrimary};
      svg {
        color: ${theme.colors.text.oppositePrimary};
      }
      :hover {
        background: ${transparentize(0.3, theme.colors.primary)};
      }
    `}
`

export const SharedBreak = styled.div`
  margin: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.medium};
  width: 100%;
  height: 4px;
  background-color: ${({ theme }) => theme.colors.gray[7]};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
`

export const SItemContent = styled.div`
  padding: 8px 0px;
  cursor: pointer;
  display: flex;
  flex-grow: 1;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme }) => theme.colors.text.heading};
  }
`
