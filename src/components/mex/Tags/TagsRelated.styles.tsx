import { HoverSubtleGlow } from '@style/helpers'
import { transparentize } from 'polished'
import styled, { css } from 'styled-components'

export const TagFlex = styled.div<{ isDisabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.tiny} ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};

  ${({ isDisabled }) =>
    !isDisabled &&
    css`
      cursor: pointer;
      ${HoverSubtleGlow}
    `}
`

export const TagsFlex = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.small};
`

export const InfoSubHeading = styled.h2`
  margin: ${({ theme }) => `${theme.spacing.large} 0 ${theme.spacing.medium} ${theme.spacing.medium}`};
  font-size: 1.2rem;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.text.fade};
`

export const ResultCardFooter = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.text.fade};

  ${TagFlex} {
    background-color: ${({ theme }) => theme.colors.gray[8]};
    ${HoverSubtleGlow}
  }
  ${({ theme, active }) =>
    active &&
    css`
      color: ${theme.colors.primary};
    `}
`
