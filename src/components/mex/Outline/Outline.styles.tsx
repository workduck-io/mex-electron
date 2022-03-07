import styled, { css } from 'styled-components'

export const OutlineItemRender = styled.div<{ level: number }>`
  color: ${({ theme }) => theme.colors.text.fade};
  padding-left: ${({ theme }) => theme.spacing.small};
  border-left: 2px solid ${({ theme }) => theme.colors.gray[7]};
  ${({ level }) =>
    css`
      margin-left: ${(level - 1) * 8}px;
      margin-top: ${0.3 + 0.067 * (7 - level)}rem;
      font-size: ${0.8 + 0.067 * (7 - level)}rem;
      opacity: ${1 - 0.067 * level};
    `}
`
