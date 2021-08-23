import styled from 'styled-components'

export const GridWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-gap: ${({ theme }) => theme.spacing.tiny};
`
