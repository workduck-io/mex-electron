import styled from 'styled-components'

export const StyledMessage = styled.div`
  border: none;
  border-radius: 0.7rem;
  margin-left: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  box-shadow: 0 2px 2px ${({ theme }) => theme.colors.background.app};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 1rem;
`
