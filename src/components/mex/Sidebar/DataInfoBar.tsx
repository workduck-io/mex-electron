import React from 'react'
import styled from 'styled-components'
import QuickLinks from '../QuickLinks'
import TagsRelated from '../Tags/TagsRelated'

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
      <QuickLinks />
      <TagsRelated />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
