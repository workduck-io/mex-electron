import styled, { css } from 'styled-components'

export const OutlineWrapper = styled.div``
export const OutlineIconWrapper = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.fade};
`

export const OutlineItemRender = styled.div<{ level?: number; heading?: boolean }>`
  color: ${({ theme }) => theme.colors.text.default};
  padding-left: ${({ theme }) => theme.spacing.small};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  cursor: pointer;
  font-size: 0.9rem;
  ${({ heading }) =>
    heading &&
    css`
      font-weight: 500;
    `}
  ${({ level, heading, theme }) =>
    level &&
    css`
      margin-left: ${heading ? (level - 1) * 8 : (level - 1) * 12}px;
      padding: ${0.2 + (heading ? 0.067 * (7 - level) : 0)}rem ${theme.spacing.small};
      font-size: ${heading ? 0.8 + 0.067 * (7 - level) : 0.9}rem;
      opacity: ${1 - 0.067 * level};
    `}

  svg {
    min-width: 16px;
    min-height: 16px;
    color: ${({ theme }) => theme.colors.text.fade};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
