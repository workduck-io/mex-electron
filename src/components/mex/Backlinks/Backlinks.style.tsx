import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { HoverSubtleGlow, SubtleGlow } from '../../../style/helpers'

export const SBackLinks = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 3rem 0;
`

export const NodeLinkStyled = styled.div<{ selected?: boolean }>`
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => transparentize(0.75, theme.colors.gray[8])};

  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.medium}`};

  ${({ selected, theme }) =>
    selected
      ? css`
          background: ${theme.colors.primary};
          color: ${theme.colors.text.oppositePrimary};
          ${SubtleGlow}
        `
      : css`
          &:nth-child(2n + 1) {
            background: ${transparentize(0.5, theme.colors.gray[8])};
          }
          ${HoverSubtleGlow}
        `}
`

export const DataInfoHeader = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.subheading};
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  svg {
    margin-right: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.primary};
  }
`
