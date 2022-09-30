import styled, { css } from 'styled-components'
import { transparentize, mix } from 'polished'
import { CardShadow } from '../../../style/helpers'
import { ResultHeader, ResultTitle } from '../../../style/Search'

export const SuggestionPreviewWrapper = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  max-height: 20rem;
`

export const SuggestionIconsGroup = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    width: 12px;
    height: 12px;
  }
`

export const SuggestionContainer = styled.div<{ highlight: boolean; type: string }>`
  overflow: hidden;
  ${({ theme }) => css`
    border-radius: ${theme.borderRadius.small};
    background-color: ${transparentize(0.5, theme.colors.gray[8])};
    + svg {
      color: ${theme.colors.primary};
    }

    ${ResultTitle} {
      font-weight: bold;
      color: ${theme.colors.primary};
    }

    :hover {
      background-color: ${theme.colors.gray[7]};
      transition: background-color 0.2s ease-in-out;
      ${CardShadow};
    }
  `}

  ${({ type, theme }) => {
    if (type === 'snippet' || type === 'template') {
      return css`
        ${ResultHeader} {
          background: ${theme.colors.gray[9]};
          background: linear-gradient(
            35deg,
            ${transparentize(0.2, theme.colors.gray[9])} 0%,
            ${transparentize(0.2, mix(0.4, theme.colors.gray[9], theme.colors.gray[9]))} 56%,
            ${transparentize(0.5, theme.colors.primary)} 100%
          );

          color: ${theme.colors.primary};
        }
        ${ResultTitle} {
          color: ${theme.colors.primary};
        }
      `
    }
  }}
`

export const Margin = styled.div`
  margin: 1rem 1rem 0;
`
