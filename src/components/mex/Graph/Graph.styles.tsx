import styled from 'styled-components'

export const StyledGraph = styled.div`
  max-height: 100vh;
  width: 100%;
  position: relative;
  * {
    outline: none;
    outline-style: none;
  }
`
export const StyledSyncBlockInfo = styled(StyledGraph)`
  overflow-y: auto;
`

export const GraphWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  height: calc(100vh - 15.5rem);

  .node-label {
    font-size: 12px;
    padding: 2px 4px;
    border-radius: 4px;
    user-select: none;
  }
`
