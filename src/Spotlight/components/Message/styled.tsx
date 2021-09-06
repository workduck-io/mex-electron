import styled from 'styled-components'

export const StyledMessage = styled.div`
  border: none;
  border-radius: 0.7rem;
  margin-left: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.sidebar};
  box-shadow: 0 2px 2px ${({ theme }) => theme.colors.background.card};
  color: ${({ theme }) => theme.colors.text.accent};
  padding: 0.5rem 1rem;
`
