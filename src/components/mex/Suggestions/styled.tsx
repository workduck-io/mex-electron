import styled, { css } from 'styled-components'
import { CardShadow } from '../../../style/helpers'
import { ResultTitle } from '../../../style/Search'

export const SuggestionContainer = styled.div<{ highlight: boolean }>`
  max-height: 400px;
  overflow: hidden auto;

  ${({ theme }) => css`
    background-color: ${theme.colors.gray[8]};
    border-radius: ${theme.borderRadius.small};

    ${ResultTitle} {
      font-weight: bold;
      color: ${theme.colors.primary};
    }

    :hover {
      cursor: pointer;
      background-color: ${theme.colors.gray[7]};
      transition: background-color 0.2s ease-in-out;
      ${CardShadow};
    }
  `}
`

export const Margin = styled.div`
  margin: 1rem 1rem 0;
`
