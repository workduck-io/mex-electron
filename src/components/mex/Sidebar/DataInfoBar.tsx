import React from 'react'
import styled from 'styled-components'
import Backlinks from '../Backlinks'
import TagsRelated from '../Tags/TagsRelated'

export const DataInfobarWrapper = styled.div`
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
      <Backlinks />
      <TagsRelated />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
