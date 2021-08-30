import styled from 'styled-components'

export const SnippetsWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.large};
`

export const SSnippets = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${({ theme }) => theme.spacing.medium};
`

const SnippetLook = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

export const SSnippet = styled(SnippetLook)`
  background-color: ${({ theme }) => theme.colors.gray[9]};
`

export const CreateSnippet = styled(SnippetLook)`
  color: ${({ theme }) => theme.colors.text.fade};
  background-color: ${({ theme }) => theme.colors.gray[8]};
`
