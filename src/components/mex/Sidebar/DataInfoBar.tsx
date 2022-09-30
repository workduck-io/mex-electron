import { CollapsableHeaderTitle } from '@workduck-io/mex-components'
import React from 'react'
import styled from 'styled-components'
import { useEditorStore } from '../../../store/useEditorStore'
import Backlinks from '../Backlinks'
import Outline from '../Outline/Outline'
import SuggestionInfoBar from '../Suggestions'
import TagsRelated from '../Tags/TagsRelated'

export const DataInfobarWrapper = styled.div`
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  justify-content: flex-start;
  gap: calc(2 * ${({ theme }) => theme.spacing.large});
  padding: ${({ theme }) => `${theme.spacing.medium}`};
  max-width: 100%;
  overflow-y: auto;

  ${CollapsableHeaderTitle} {
    font-size: 1.5rem;
  }
`

const DataInfoBar = () => {
  const node = useEditorStore((state) => state.node)

  return (
    <DataInfobarWrapper>
      <TagsRelated nodeid={node.nodeid} fromAnalysis />
      <SuggestionInfoBar />
      <Outline />
      <Backlinks nodeid={node.nodeid} />
    </DataInfobarWrapper>
  )
}

export default DataInfoBar
