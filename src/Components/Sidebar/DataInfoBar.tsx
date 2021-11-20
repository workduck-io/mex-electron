import React from 'react'
import styled from 'styled-components'
import Backlinks from '../Backlinks/Backlinks'
import Metadata from '../Metadata/Metadata'

const DataInfobarWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 300px;
`

const DataInfoBar = () => {
  return (
    <DataInfobarWrapper>
      <Metadata />
      <Backlinks />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
