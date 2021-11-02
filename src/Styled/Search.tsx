import { transparentize } from 'polished'
import styled, { css } from 'styled-components'
import { Input } from './Form'
import { CardShadow } from './helpers'
import { size } from './responsive'

interface ResultProps {
  selected?: boolean
}

export const SearchInput = styled(Input)`
  width: 100%;
  max-width: 20rem;
  transition: all 0.25s ease-in-out;
  &:focus {
    max-width: 30rem;
  }
`

export const SearchHeader = styled.div`
  display: flex;
  align-items: center;
  svg {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const SearchContainer = styled.div`
  margin: ${({ theme: { spacing } }) => `4rem ${spacing.medium}`};
`

export const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text.fade};
`

export const ResultTitle = styled.div`
  color: ${({ theme }) => theme.colors.text.default};
`

export const Result = styled.div<ResultProps>`
  max-height: 300px;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  transition: all 0.25s ease-in-out;

  :hover {
    cursor: pointer;
    ${CardShadow}
    transform: scale(1.025) translateY(-10px);
  }

  ${({ theme, selected }) =>
    selected &&
    css`
      ${CardShadow}
      transform: scale(1.025) translateY(-10px);
      ${ResultTitle} {
        font-weight: bold;
        color: ${theme.colors.primary};
      }
    `}
`

export const Results = styled.div`
  margin-top: ${({ theme }) => theme.spacing.large};
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing.large};
  grid-auto-flow: row;

  @media (max-width: ${size.wide}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${size.wide}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

export const SearchPreviewWrapper = styled.div``

export const SSearchHighlights = styled.div`
  padding: ${({ theme }) => theme.spacing.medium};
`

export const HighlightWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.tiny};

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const Highlight = styled.span`
  padding: ${({ theme: { spacing } }) => `${spacing.tiny} ${spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text.oppositePrimary};
`

export const MatchCounterWrapper = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.text.fade};
  font-size: 0.9rem;
`
export const MatchCounter = styled.div`
  margin-left: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
`
