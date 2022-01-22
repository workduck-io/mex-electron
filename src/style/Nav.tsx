import styled, { css } from 'styled-components'

export const NavButton = styled.div<{ primary?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[5]};
  padding: ${({ theme }) => theme.spacing.small};
  margin-top: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.card};
  }

  ${({ theme, primary }) =>
    primary &&
    css`
      color: ${theme.colors.text.oppositePrimary};
      background-color: ${theme.colors.primary};
      transition: all 0.25s ease-in-out;

      &:hover {
        background-color: ${theme.colors.text.oppositePrimary};
        color: ${theme.colors.primary};
      }
    `}
`
