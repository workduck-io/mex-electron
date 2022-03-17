import styled from 'styled-components'

export const StyledGraph = styled.div`
  max-height: 100vh;
  width: 100%;
  position: relative;
  min-width: 600px;
  * {
    outline: none;
    outline-style: none;
  }
`
export const StyledSyncBlockInfo = styled(StyledGraph)`
  overflow-y: auto;
`

export const GraphWrapper = styled.div`
  height: calc(100vh - 8.5rem);
`
