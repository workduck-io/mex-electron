import React from 'react'
import styled from 'styled-components'
import { useEditorStore } from '../../../store/useEditorStore'
import Backlinks from '../Backlinks'
import Outline from '../Outline/Outline'
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
  const node = useEditorStore((state) => state.node)

  return (
    <DataInfobarWrapper>
      <Outline />
      <Backlinks nodeid={node.nodeid} />
      <TagsRelated nodeid={node.nodeid} />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
