import styled from 'styled-components'
import { Card } from './Card'
import { GridCss } from './Grid'
import { size } from './responsive'
import { ResultDesc, SearchContainer } from './Search'

export const SSnippets = styled.div`
  ${GridCss(2, 3)}
`

export const SSnippet = styled(Card)`
  background-color: ${({ theme }) => theme.colors.gray[9]};
  overflow: auto;
`

export const SnippetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium};
`

export const StyledSnippetPreview = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SnippetCommandPrefix = styled.div`
  color: ${({ theme }) => theme.colors.primary};
`
export const SnippetCommand = styled.div`
  display: flex;
  font-size: 1.5rem;
  margin: ${({ theme }) => theme.spacing.medium} 0;
  color: ${({ theme }) => theme.colors.text.heading};
`

export const CreateSnippet = styled(Card)`
  color: ${({ theme }) => theme.colors.text.fade};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  font-size: 1.5rem;
  flex-direction: column;
  height: auto;
  max-height: 300px;
  padding: ${({ theme }) => theme.spacing.small} 0;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    filter: drop-shadow(0px 4px 10px ${({ theme }) => theme.colors.primary});
  }
`

export const TemplateToggle = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.tiny};
  background-color: ${({ theme }) => theme.colors.gray[9]};
  color: ${({ theme }) => theme.colors.text.fade};
  font-weight: normal;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.tiny};
  svg {
    color: ${({ theme }) => theme.colors.text.default};
  }
  padding: 0.25rem ${({ theme }) => theme.spacing.small};
  font-size: 1rem;
`

export const SnippetsSearchContainer = styled(SearchContainer)`
  ${ResultDesc} {
    @media (max-width: ${size.normal}) {
      max-width: 15rem;
    }
  }
`
