import styled, { css } from 'styled-components'
import { Input } from './Form'
import { size } from './responsive'

interface ResultProps {
  selected?: boolean
}
export const Result = styled.div<ResultProps>`
  height: 300px;
  overflow-y: auto;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[9]};

  ${({ theme, selected }) =>
    selected &&
    css`
      border: 1px solid ${theme.colors.primary};
    `}
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
  svg {
    height: 1.5rem;
    width: 1.5rem;
    margin-right: ${({ theme }) => theme.spacing.small};
    color: ${({ theme }) => theme.colors.primary};
  }
`

export const SearchContainer = styled.div`
  margin: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium}`};
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
