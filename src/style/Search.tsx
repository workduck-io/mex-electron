import { transparentize } from 'polished'
import { animated } from 'react-spring'
import styled, { css } from 'styled-components'
import { Ellipsis } from '../components/mex/Integrations/Template/styled'
import { View } from '../components/mex/Search/ViewSelector'
import { EditorStyles } from './Editor'
import { Input } from './Form'
import { CardShadow } from './helpers'
import { size } from './responsive'

interface ResultProps {
  selected?: boolean
}

const SearchTransition = css`
  transition: all 0.2s ease-in-out;
`

export const InputWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
  svg {
    height: 1.5rem;
    width: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }
`

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
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.small};
`

export const SearchContainer = styled.div`
  margin: ${({ theme: { spacing } }) => `4rem ${spacing.medium}`};
  position: relative;
`

export const NoSearchResults = styled.div`
  width: 100%;
  height: 3rem;
  font-size: 1.2rem;
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text.fade};
  position: absolute;
  top: 0;
`

export const ResultHeader = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
  background-color: ${({ theme }) => theme.colors.gray[8]};
  padding: ${({ theme }) => theme.spacing.medium};
  color: ${({ theme }) => theme.colors.text.fade};
  ${({ theme, active }) =>
    active &&
    css`
      color: ${({ theme }) => theme.colors.primary};

      ${ResultTitle} {
        color: ${theme.colors.primary};
      }
    `}
`

export const ResultRow = styled.div<{ active?: boolean; selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `0.5rem ${theme.spacing.medium}`};
  color: ${({ theme }) => theme.colors.text.fade};
  width: 100%;
  ${SearchTransition}

  & > svg {
    ${SearchTransition}
    height: 1.35rem;
    width: 1.35rem;
    color: ${({ theme }) => theme.colors.gray[5]};
  }
  ${({ theme, selected }) =>
    selected &&
    css`
      & > svg {
        color: ${theme.colors.primary};
      }
    `}
`

export const ResultMain = styled.div`
  align-self: flex-start;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.tiny};
`

export const ResultTitle = styled.div`
  ${SearchTransition}
  color: ${({ theme }) => theme.colors.text.default};
`

export const ResultDesc = styled.div`
  flex-shrink: 1;
  color: ${({ theme }) => theme.colors.gray[5]};
  font-size: 0.8rem;
  max-width: 20rem;

  ${Ellipsis}
`
export const Result = styled(animated.div)<{ selected?: boolean; view?: View }>`
  background-color: ${({ theme }) => theme.colors.gray[9]};
  ${({ theme, selected, view }) => {
    if (view === View.Card) {
      return css`
        max-height: 300px;
        overflow-y: auto;
        ${selected &&
        css`
          ${CardShadow}
          transform: scale(1.025) translateY(-10px);
          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.colors.primary};
          }
        `}
        :hover {
          cursor: pointer;
          ${CardShadow}
          transform: scale(1.025) translateY(-10px);
        }
      `
    } else if (view === View.List) {
      return css`
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        width: 100%;
        border: 1px solid transparent;
        ${selected &&
        css`
          background-color: ${theme.colors.gray[8]};
          border: 1px solid ${theme.colors.primary};
          ${ResultTitle} {
            font-weight: bold;
            color: ${theme.colors.primary};
          }
        `}
        :hover {
          cursor: pointer;
          transform: translateX(-10px);
        }
      `
    }
  }}
  border-radius: ${({ theme }) => theme.borderRadius.small};
  ${SearchTransition}
`

export const Results = styled.div<{ view: View }>`
  ${({ theme, view }) => {
    if (view === View.Card) {
      return css`
        display: grid;
        grid-gap: ${theme.spacing.large};
        grid-auto-flow: row;

        @media (max-width: ${size.wide}) {
          grid-template-columns: repeat(2, 1fr);
        }

        @media (min-width: ${size.wide}) {
          grid-template-columns: repeat(3, 1fr);
        }
      `
    } else if (view === View.List) {
      return css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: ${theme.spacing.tiny};
        flex-grow: 1;
      `
    }
  }}
`

export const ResultsWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.large};
  position: relative;
`

export const SearchPreviewWrapper = styled.div<{ active?: boolean }>`
  ${({ theme, active }) => active && css``}
`

export const SplitSearchPreviewWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.large};
  background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[9])};
  padding: ${({ theme }) => theme.spacing.medium};

  ${EditorStyles} {
    max-height: 40vh;
    overflow-y: auto;
  }
`

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

export const TitleHighlightWrapper = styled.div`
  margin-bottom: 0;
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
