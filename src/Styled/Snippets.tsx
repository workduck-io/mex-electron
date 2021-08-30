import styled from 'styled-components'

export const SnippetsWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.large};
  width: 100%;
`

export const SSnippets = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: ${({ theme }) => theme.spacing.medium};
`

const SnippetLook = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.medium};
  height: 300px;
  border-radius: ${({ theme }) => theme.borderRadius.large};
`

export const SSnippet = styled(SnippetLook)`
  background-color: ${({ theme }) => theme.colors.gray[9]};
  overflow: auto;
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
