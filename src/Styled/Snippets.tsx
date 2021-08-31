import styled from 'styled-components'
import Editor from '../Editor/Editor'

import { size } from './responsive'

export const SnippetsWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.large};
  width: 100%;
`

export const SSnippets = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing.medium};

  @media (max-width: ${size.wide}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${size.wide}) {
    grid-template-columns: repeat(3, 1fr);
  }
`

const SnippetLook = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.medium};
  height: 400px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

export const SSnippet = styled(SnippetLook)`
  background-color: ${({ theme }) => theme.colors.gray[9]};
  overflow: auto;
`

export const StyledSnippetPreview = styled.div`
  background-color: ${({ theme }) => theme.colors.gray[8]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SnippetCommandPrefix = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
`
export const SnippetCommand = styled.div`
  display: flex;
  font-size: 1.5rem;
  margin: ${({ theme }) => theme.spacing.medium} 0;
  color: ${({ theme }) => theme.colors.text.heading};
`

export const CreateSnippet = styled(SnippetLook)`
  color: ${({ theme }) => theme.colors.text.fade};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 600;
  font-size: 1.5rem;
  flex-direction: column;

  svg {
    color: ${({ theme }) => theme.colors.secondary};
    filter: drop-shadow(0px 4px 10px ${({ theme }) => theme.colors.secondary});
  }
`
