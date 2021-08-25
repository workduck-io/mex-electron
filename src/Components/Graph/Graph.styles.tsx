import styled from 'styled-components'

export const StyledGraph = styled.div`
  /* width: 100%; */
  max-height: 100vh;
  width: 100%;
  /* position: fixed; */
  /* top: 0; */
  /* right: 0; */
  /* border: 3px solid red; */
  * {
    outline: none;
    outline-style: none;
  }
`
export const GraphTools = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: ${({ theme: { spacing } }) => `${spacing.large} ${spacing.medium}`};

  background-color: ${({ theme }) => theme.colors.gray[9]};
  padding: ${({ theme }) => `${theme.spacing.small} ${theme.spacing.small}`};
  border-radius: ${({ theme }) => theme.borderRadius.small};
`
