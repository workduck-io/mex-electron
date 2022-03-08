import styled, { css } from 'styled-components'

export const OutlineWrapper = styled.div``

export const OutlineItemRender = styled.div<{ level: number }>`
  color: ${({ theme }) => theme.colors.text.fade};
  padding-left: ${({ theme }) => theme.spacing.small};
  border-left: 2px solid ${({ theme }) => theme.colors.gray[7]};
  cursor: pointer;
  ${({ level }) =>
    css`
      margin-left: ${(level - 1) * 8}px;
      padding: ${0.2 + 0.067 * (7 - level)}rem ${({ theme }) => theme.spacing.small};
      font-size: ${0.8 + 0.067 * (7 - level)}rem;
      opacity: ${1 - 0.067 * level};
    `}

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
